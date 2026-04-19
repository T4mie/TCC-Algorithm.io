from flask import Flask, jsonify, request
from structures.SLL import SLL
from structures.Vector import Vector
from algorithms.insertion_sort import InsertionSort

app = Flask(__name__)
storageSLL = SLL()
storageVector = Vector()


#  ===== UTILS  ===== 

def is_single_char(value):
    """Verifica se o valor é um único caractere válido (a-z, A-Z, 0-9)"""
    if not isinstance(value, str):
        return False
    # aceitar apenas letras (a-z, A-Z)
    return len(value) == 1 and value.isalpha()

def is_integer(value):
    """Verifica se o valor é um inteiro válido"""
    if isinstance(value, bool):  # bool é subclasse de int em Python
        return False
    return isinstance(value, int) or (isinstance(value, str) and value.isdigit())

# ===== ROTAS PARA GERENCIAR NÓS  SLL =====

@app.route("/nodes_last", methods=["POST"])
def create_node_last():
    """Cria um novo nó no final com um valor"""
    data = request.json
    if not data or "value" not in data:
        return jsonify({"error": "Campo 'value' é obrigatório"}), 400
    if not is_single_char(data.get("value")):
        return jsonify({"error": "O valor deve ser uma única letra (a-z, A-Z)"}), 400

    node = storageSLL.add_node_last(
        value=data.get("value"),
        position=data.get("position"),
        label=data.get("label"),
        node_type=data.get("type"),
        node_id=data.get("id")
    )
    return jsonify(node.to_dict()), 201

@app.route("/nodes_first", methods=["POST"])
def create_node_first():
    """Cria um novo nó no início com um valor"""
    data = request.json
    if not data or "value" not in data:
        return jsonify({"error": "Campo 'value' é obrigatório"}), 400
    if not is_single_char(data.get("value")):
        return jsonify({"error": "O valor deve ser uma única letra (a-z, A-Z)"}), 400

    node = storageSLL.add_node_first(
        value=data.get("value"),
        position=data.get("position"),
        label=data.get("label"),
        node_type=data.get("type"),
        node_id=data.get("id")
    )
    return jsonify(node.to_dict()), 201

@app.route("/SLL_data", methods=["GET"])
def get_all_data():
    """Retorna toda a estrutura (nós + edges)"""
    return jsonify(storageSLL.to_dict())

# ===== ROTAS PARA GERENCIAR NÓS VECTOR ===== #

@app.route("/create_vector", methods=["POST"])
def create_vector():
    data = request.json
    if not data or "value" not in data:
        return jsonify({"error": "Campo 'value' é obrigatório"}), 400
    
    if not is_integer(data.get("value")):
        return jsonify({"error": "O valor deve ser um inteiro válido"}), 400

    node = storageVector.create_vector(
        size=int(data.get("value")),
        position=data.get("position")
    )
    return jsonify([node.to_dict() for node in node]), 201

@app.route("/insert_vector", methods=["POST"])
def insert_value():
    data = request.json
    if not data or "node_id" not in data or "value" not in data:
        return jsonify({"error": "Campos 'node_id' e 'value' são obrigatórios"}), 400
    
    if not is_integer(data.get("node_id")):
        return jsonify({"error": "O node_id deve ser um inteiro válido"}), 400
    # permitir letras únicas ou inteiros (inclui múltiplos dígitos, ex: "22")
    value = data.get("value")
    if not (is_single_char(value) or is_integer(value)):
        return jsonify({"error": "O valor deve ser uma única letra (a-z, A-Z) ou um inteiro (ex: 22)"}), 400

    try:
        storageVector.insert_value(data["node_id"], data["value"])
        return jsonify({"message": "Valor inserido com sucesso"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@app.route("/vector_data", methods=["GET"])
def get_vector_data():
    """Retorna toda a estrutura do vetor (nós + edges)"""
    return jsonify(storageVector.to_dict())

#  ===== ROTA PARA EXECUTAR O ALGORITMO DE ORDENAÇÃO (EXEMPLO COM INSERTION SORT) =====
@app.route("/insertion-sort", methods=["POST"])
def insertion_sort():
    """Executa insertion sort e retorna todos os passos para animação"""
    try:
        sorter = InsertionSort(storageSLL)
        steps = sorter.sort()
        return jsonify({
            "success": True,
            "steps": steps
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(port=5000, debug=True)

# POR ENQUANTO, NÃO UTILIZADO --------------------------------------------------------------------

# @app.route("/nodes", methods=["GET"])
# def get_all_nodes():
#     """Retorna todos os nós"""
#     nodes = storageSLL.get_all_nodes()
#     return jsonify([node.to_dict() for node in nodes])

# @app.route("/nodes/<node_id>", methods=["GET"])
# def get_node(node_id):
#     """Retorna um nó específico"""
#     node = storageSLL.get_node(node_id)
#     if not node:
#         return jsonify({"error": "Nó não encontrado"}), 404
#     return jsonify(node.to_dict())

# @app.route("/nodes/<node_id>", methods=["DELETE"])
# def delete_node(node_id):
#     """Deleta um nó"""
#     try:
#         storageSLL.delete_node(node_id)
#         return jsonify({"message": "Nó deletado com sucesso"}), 200
#     except ValueError as e:
#         return jsonify({"error": str(e)}), 404

# ===== ROTAS PARA GERENCIAR EDGES =====

# @app.route("/edges", methods=["POST"])
# def create_edge():
#     """Cria uma ligação entre dois nós"""
#     data = request.json
#     if not data or "source_id" not in data or "target_id" not in data:
#         return jsonify({"error": "Campos 'source_id' e 'target_id' são obrigatórios"}), 400
    
#     relation = data.get("relation", "next")
#     try:
#         edge = storageSLL.add_edge(data["source_id"], data["target_id"], relation)
#         return jsonify(edge.to_dict()), 201
#     except ValueError as e:
#         return jsonify({"error": str(e)}), 400

# @app.route("/edges", methods=["GET"])
# def get_all_edges():
#     """Retorna todas as ligações"""
#     edges = storageSLL.get_all_edges()
#     return jsonify([edge.to_dict() for edge in edges])