from flask import Flask, jsonify, request
from models.storage import Storage

app = Flask(__name__)
storage = Storage()

# ===== ROTAS PARA GERENCIAR NÓS =====

@app.route("/nodes_last", methods=["POST"])
def create_node_last():
    """Cria um novo nó no final com um valor"""
    data = request.json
    if not data or "value" not in data:
        return jsonify({"error": "Campo 'value' é obrigatório"}), 400

    node = storage.add_node_last(data["value"])
    return jsonify(node.to_dict()), 201

@app.route("/nodes_first", methods=["POST"])
def create_node_first():
    """Cria um novo nó no início com um valor"""
    data = request.json
    if not data or "value" not in data:
        return jsonify({"error": "Campo 'value' é obrigatório"}), 400

    node = storage.add_node_first(data["value"])
    return jsonify(node.to_dict()), 201

@app.route("/data", methods=["GET"])
def get_all_data():
    """Retorna toda a estrutura (nós + edges)"""
    return jsonify(storage.to_dict())

if __name__ == "__main__":
    app.run(port=5000, debug=True)

# POR ENQUANTO, NÃO UTILIZADO --------------------------------------------------------------------

# @app.route("/nodes", methods=["GET"])
# def get_all_nodes():
#     """Retorna todos os nós"""
#     nodes = storage.get_all_nodes()
#     return jsonify([node.to_dict() for node in nodes])

# @app.route("/nodes/<node_id>", methods=["GET"])
# def get_node(node_id):
#     """Retorna um nó específico"""
#     node = storage.get_node(node_id)
#     if not node:
#         return jsonify({"error": "Nó não encontrado"}), 404
#     return jsonify(node.to_dict())

# @app.route("/nodes/<node_id>", methods=["DELETE"])
# def delete_node(node_id):
#     """Deleta um nó"""
#     try:
#         storage.delete_node(node_id)
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
#         edge = storage.add_edge(data["source_id"], data["target_id"], relation)
#         return jsonify(edge.to_dict()), 201
#     except ValueError as e:
#         return jsonify({"error": str(e)}), 400

# @app.route("/edges", methods=["GET"])
# def get_all_edges():
#     """Retorna todas as ligações"""
#     edges = storage.get_all_edges()
#     return jsonify([edge.to_dict() for edge in edges])