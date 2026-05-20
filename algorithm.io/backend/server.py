from flask import Flask, jsonify, request
from structures.SLL import SLL
from structures.Vector import Vector
from algorithms.insertion_sort import InsertionSort

app = Flask(__name__)
storageSLL = SLL()
storageVector = Vector()


#  ===== UTILS (mudar de lugar)  ===== 

def is_single_char(value):
    """Verifica se o valor é uma única letra"""
    if not isinstance(value, str):
        return False
    return len(value) == 1 and value.isalnum()

def is_integer(value):
    """Verifica se o valor é um inteiro ou uma string que representa um inteiro"""
    if isinstance(value, bool): 
        return False
    if isinstance(value, int):
        return True
    if isinstance(value, str):
        return value.lstrip('-').isdigit() # Lida com números negativos em string
    return False

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
    
    # Converter node_id para int (índice do vetor)
    try:
        node_id = int(data.get("node_id"))
    except:
        return jsonify({"error": "O node_id deve ser um inteiro válido"}), 400

    value = data.get("value")
    
    # Validação lógica:
    if is_integer(value):
        # Se for um inteiro (ou string numérica), converte para int real
        value = int(value)
    elif is_single_char(value):
        # Se for uma letra, mantém como string
        value = str(value)
    else:
        return jsonify({"error": "O valor deve ser uma única letra ou um inteiro"}), 400

    try:
        storageVector.insert_value(node_id, value)
        return jsonify({"message": "Valor inserido com sucesso"}), 200
    except Exception as e:
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
        # Validação pré-requisitos
        if not storageVector.nodes:
            return jsonify({
                "success": False,
                "error": "Nenhum vetor foi criado. Chame /create_vector primeiro."
            }), 400
        
        # Verificar se há dados para ordenar
        data_indices = [i for i, node in enumerate(storageVector.nodes) 
                        if node.value is not None]
        if not data_indices:
            return jsonify({
                "success": False,
                "error": "O vetor está vazio. Insira valores com /insert_vector."
            }), 400
        
        sorter = InsertionSort(storageVector)
        steps = sorter.sort()
        
        # Log code_ids for debugging (helps verifying SHIFT/DECREMENT_I presence)
        try:
            code_ids = [s.get('code_id') for s in steps]
        except Exception:
            code_ids = None
        app.logger.debug(f"insertion-sort: steps_count={len(steps)} code_ids={code_ids}")

        # Retornar steps e o estado final baseado na cópia do sorter
        # (não mutamos storageVector aqui).
        final = None
        try:
            final = sorter.final_state()
        except Exception:
            final = storageVector.to_dict()

        return jsonify({
            "success": True,
            "steps": steps,
            "data": final
        }), 200
        
    except AttributeError as e:
        app.logger.error(f"Erro de estrutura de dados: {e}")
        return jsonify({
            "success": False,
            "error": "Estrutura de dados inválida no servidor"
        }), 500
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": f"Dados inválidos: {str(e)}"
        }), 400
    except Exception as e:
        app.logger.error(f"Erro inesperado em insertion-sort: {e}")
        return jsonify({
            "success": False,
            "error": "Erro inesperado no servidor"
        }), 500


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