from flask import Flask, jsonify, request
from structures.SLL import SLL
from structures.Vector import Vector
from structures.Queue import Queue
from algorithms.insertion_sort import InsertionSort
from services.utils import is_single_char, is_integer

# ===== CONFIGURAÇÃO DA APLICAÇÃO =====
app = Flask(__name__)
storageSLL = SLL()
storageVector = Vector()
storageQueue = Queue()


def json_error(message, status=400):
    """Retorna um JSON de erro padronizado para as rotas."""
    return jsonify({"error": message}), status


def parse_int(value, name="valor"):
    """Tenta converter um valor para inteiro, retornando None em falha."""
    try:
        return int(value)
    except (TypeError, ValueError):
        raise ValueError(f"O campo '{name}' deve ser um inteiro válido")


# ===== ROTAS PARA GERENCIAR NÓS SLL =====

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

# ===== ROTAS PARA GERENCIAR A FILA =====

@app.route("/queue_enqueue", methods=["POST"])
def queue_enqueue():
    data = request.json
    if not data or "value" not in data:
        return json_error("Campo 'value' é obrigatório")
    if not is_single_char(data.get("value")) and not is_integer(data.get("value")):
        return jsonify({"error": "O valor deve ser uma única letra ou um inteiro"}), 400

    value = data.get("value")
    if is_integer(value):
        value = int(value)
    elif is_single_char(value):
        value = str(value).upper()

    node = storageQueue.enqueue(
        value=value,
        position=data.get("position"),
        label=data.get("label"),
        node_type=data.get("type"),
        node_id=data.get("id")
    )
    return jsonify(node.to_dict()), 201

@app.route("/queue_dequeue", methods=["POST"])
def queue_dequeue():
    try:
        node = storageQueue.dequeue()
        return jsonify(node.to_dict()), 200
    except ValueError as exc:
        return json_error(str(exc))

@app.route("/queue_data", methods=["GET"])
def get_queue_data():
    return jsonify(storageQueue.to_dict())

# ===== ROTAS PARA GERENCIAR NÓS VECTOR ===== #

@app.route("/create_vector", methods=["POST"])
def create_vector():
    data = request.json
    if not data or "value" not in data:
        return json_error("Campo 'value' é obrigatório")

    try:
        size = parse_int(data.get("value"), name='value')
    except ValueError as exc:
        return json_error(str(exc))

    nodes = storageVector.create_vector(
        size=size,
        position=data.get("position")
    )
    return jsonify([node.to_dict() for node in nodes]), 201

@app.route("/insert_vector", methods=["POST"])
def insert_value():
    data = request.json
    if not data or "node_id" not in data or "value" not in data:
        return json_error("Campos 'node_id' e 'value' são obrigatórios")

    try:
        node_id = parse_int(data.get("node_id"), name='node_id')
    except ValueError as exc:
        return json_error(str(exc))

    value = data.get("value")
    value_type = None
    
    # Validação lógica:
    if is_integer(value):
        # Se for um inteiro (ou string numérica), converte para int real
        value = int(value)
        value_type = 'int'
    elif is_single_char(value):
        # Se for uma letra, converte para uppercase
        value = str(value).upper()
        value_type = 'string'
    else:
        return jsonify({"error": "O valor deve ser uma única letra ou um inteiro"}), 400

    # Verificar tipo de dados atual do vetor
    current_type = storageVector.get_vector_data_type()
    reset_happened = False
    
    # Se o vetor tem dados de um tipo diferente, reseta
    if current_type and current_type != value_type and storageVector.nodes:
        # Reseta o vetor mantendo o tamanho
        size = len(storageVector.nodes)
        storageVector.create_vector(size)
        reset_happened = True

    try:
        storageVector.insert_value(node_id, value)
        response = {"message": "Valor inserido com sucesso"}
        if reset_happened:
            response["reset"] = True
            response["info"] = "Vetor foi resetado pois você inseriu um tipo de dado diferente"
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/vector_data", methods=["GET"])
def get_vector_data():
    """Retorna toda a estrutura do vetor (nós + edges)"""
    return jsonify(storageVector.to_dict())

@app.route("/update_vector", methods=["POST"])
def update_vector():
    """Atualiza o vetor com o estado final (após ordenação)"""
    data = request.json
    if not data or "nodes" not in data:
        return jsonify({"error": "Campo 'nodes' é obrigatório"}), 400
    
    try:
        # Atualiza os valores do vetor com os valores ordenados
        nodes_data = data.get("nodes", [])
        for idx, node_data in enumerate(nodes_data):
            if idx < len(storageVector.nodes):
                storageVector.nodes[idx].value = node_data.get("value")
        
        return jsonify({"message": "Vetor atualizado com sucesso", "data": storageVector.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

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
        app.logger.debug("insertion-sort: steps_count=%d code_ids=%s", len(steps), code_ids)

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
