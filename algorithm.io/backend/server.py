from flask import Flask, jsonify, request
from structures.SLL import SLL
from structures.Vector import Vector
from structures.Queue import Queue
from structures.Stack import Stack
from algorithms.insertion_sort import InsertionSort
from algorithms.stack_operations import StackOperations
from algorithms.queue_operations import QueueOperations
from services.utils import is_single_char, is_integer

# ===== CONFIGURAÇÃO DA APLICAÇÃO =====
app = Flask(__name__)
storageSLL = SLL()
storageVector = Vector()
storageQueue = Queue()
storageStack = Stack()

# Guarda os últimos passos gerados (push ou pop) para que a janela filha do
# CodeView possa buscá-los via GET sem precisar reenviar o valor empilhado.
last_stack_steps = {"op": None, "steps": []}

# Idem para a fila (enqueue/dequeue).
last_queue_steps = {"op": None, "steps": []}


def json_error(message, status=400):
    """Retorna um JSON de erro padronizado para as rotas."""
    return jsonify({"error": message}), status


def parse_int(value, name="valor"):
    """Converte um valor para inteiro, levantando ValueError com mensagem
    amigável em caso de falha."""
    try:
        return int(value)
    except (TypeError, ValueError):
        raise ValueError(f"O campo '{name}' deve ser um inteiro válido")


# ===== ROTAS PARA GERENCIAR NÓS SLL =====

@app.route("/nodes_last", methods=["POST"])
def create_node_last():
    """Cria um novo nó no final da lista (tail)."""
    data = request.json
    if not data or "value" not in data:
        return json_error("Campo 'value' é obrigatório")
    if not is_single_char(data.get("value")):
        return json_error("O valor deve ser uma única letra (a-z, A-Z)")

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
    """Cria um novo nó no início da lista (head)."""
    data = request.json
    if not data or "value" not in data:
        return json_error("Campo 'value' é obrigatório")
    if not is_single_char(data.get("value")):
        return json_error("O valor deve ser uma única letra (a-z, A-Z)")

    node = storageSLL.add_node_first(
        value=data.get("value"),
        position=data.get("position"),
        label=data.get("label"),
        node_type=data.get("type"),
        node_id=data.get("id")
    )
    return jsonify(node.to_dict()), 201


@app.route("/nodes_remove_first", methods=["POST"])
def remove_node_first():
    """Remove o nó do início (head) da lista."""
    try:
        removed_id = storageSLL.remove_first()
        return jsonify({"message": "Nó removido do início", "removed_id": removed_id}), 200
    except ValueError as exc:
        return json_error(str(exc))


@app.route("/nodes_remove_last", methods=["POST"])
def remove_node_last():
    """Remove o nó do final (tail) da lista."""
    try:
        removed_id = storageSLL.remove_last()
        return jsonify({"message": "Nó removido do final", "removed_id": removed_id}), 200
    except ValueError as exc:
        return json_error(str(exc))


@app.route("/SLL_data", methods=["GET"])
def get_all_data():
    """Retorna toda a estrutura da lista encadeada (nós + edges)."""
    return jsonify(storageSLL.to_dict())


@app.route("/clear_sll", methods=["POST"])
def clear_sll():
    """Limpa a lista, como se ela nunca tivesse sido usada."""
    storageSLL.clear()
    return jsonify({"message": "Lista limpa com sucesso"}), 200


# ===== ROTAS PARA GERENCIAR A FILA =====

def _apply_queue_ops(ops):
    """Efetiva no storageQueue real o resultado (já calculado sobre uma
    cópia) de uma simulação de enqueue/dequeue."""
    storageQueue.nodes = ops.nodes
    storageQueue.edges = ops.edges
    storageQueue.head = ops.head
    storageQueue.tail = ops.tail
    storageQueue.size = ops.size
    storageQueue.node_counter = ops.node_counter
    storageQueue.list_node = ops.list_node


@app.route("/queue_enqueue_steps", methods=["POST"])
def queue_enqueue_steps():
    """Executa enqueue e retorna todos os passos para a simulação passo a passo."""
    data = request.json
    if not data or "value" not in data:
        return jsonify({"success": False, "error": "Campo 'value' é obrigatório"}), 400
    if not is_single_char(data.get("value")) and not is_integer(data.get("value")):
        return jsonify({"success": False, "error": "O valor deve ser uma única letra ou um inteiro"}), 400

    value = data.get("value")
    if is_integer(value):
        value = int(value)
    elif is_single_char(value):
        value = str(value).upper()

    try:
        ops = QueueOperations(storageQueue)
        steps = ops.enqueue(value, position=data.get("position"), label=data.get("label"))
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    _apply_queue_ops(ops)

    global last_queue_steps
    last_queue_steps = {"op": "enqueue", "steps": steps}

    return jsonify({"success": True, "steps": steps, "data": ops.final_state()}), 200


@app.route("/queue_dequeue_steps", methods=["POST"])
def queue_dequeue_steps():
    """Executa dequeue e retorna todos os passos para a simulação passo a passo."""
    if storageQueue.head is None:
        return jsonify({"success": False, "error": "A fila está vazia"}), 400

    try:
        ops = QueueOperations(storageQueue)
        steps = ops.dequeue()
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    _apply_queue_ops(ops)

    global last_queue_steps
    last_queue_steps = {"op": "dequeue", "steps": steps}

    return jsonify({"success": True, "steps": steps, "data": ops.final_state()}), 200


@app.route("/queue_steps", methods=["GET"])
def get_queue_steps():
    """Retorna os últimos passos gerados (enqueue ou dequeue), usado pela janela do CodeView."""
    return jsonify(last_queue_steps), 200


@app.route("/queue_data", methods=["GET"])
def get_queue_data():
    """Retorna toda a estrutura da fila (nós + edges)."""
    return jsonify(storageQueue.to_dict())


@app.route("/clear_queue", methods=["POST"])
def clear_queue():
    """Limpa a fila, como se ela nunca tivesse sido usada."""
    storageQueue.clear()

    global last_queue_steps
    last_queue_steps = {"op": None, "steps": []}

    return jsonify({"message": "Fila limpa com sucesso"}), 200


# ===== ROTAS PARA GERENCIAR NÓS VECTOR =====

@app.route("/create_vector", methods=["POST"])
def create_vector():
    """Cria um vetor vazio com o tamanho informado, descartando o anterior."""
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
    """Insere um valor em uma posição do vetor, resetando-o se o tipo de
    dado mudar em relação ao que já estava armazenado."""
    data = request.json
    if not data or "node_id" not in data or "value" not in data:
        return json_error("Campos 'node_id' e 'value' são obrigatórios")

    try:
        node_id = parse_int(data.get("node_id"), name='node_id')
    except ValueError as exc:
        return json_error(str(exc))

    value = data.get("value")
    value_type = None

    # Validação lógica: aceita apenas uma letra única ou um inteiro.
    if is_integer(value):
        # Se for um inteiro (ou string numérica), converte para int real
        value = int(value)
        value_type = 'int'
    elif is_single_char(value):
        # Se for uma letra, converte para uppercase
        value = str(value).upper()
        value_type = 'string'
    else:
        return json_error("O valor deve ser uma única letra ou um inteiro")

    # Verificar tipo de dados atual do vetor
    current_type = storageVector.get_vector_data_type()
    reset_happened = False

    # Se o vetor tem dados de um tipo diferente, reseta mantendo o tamanho
    if current_type and current_type != value_type and storageVector.nodes:
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
        return json_error(str(e))


@app.route("/vector_data", methods=["GET"])
def get_vector_data():
    """Retorna toda a estrutura do vetor (nós + edges)."""
    return jsonify(storageVector.to_dict())


@app.route("/clear_vector", methods=["POST"])
def clear_vector():
    """Limpa o vetor, como se ele nunca tivesse sido criado (inclusive o tamanho)."""
    storageVector.clear()
    return jsonify({"message": "Vetor limpo com sucesso"}), 200


@app.route("/update_vector", methods=["POST"])
def update_vector():
    """Atualiza o vetor com o estado final (após ordenação)."""
    data = request.json
    if not data or "nodes" not in data:
        return json_error("Campo 'nodes' é obrigatório")

    try:
        # Atualiza os valores do vetor com os valores ordenados
        nodes_data = data.get("nodes", [])
        for idx, node_data in enumerate(nodes_data):
            if idx < len(storageVector.nodes):
                storageVector.nodes[idx].value = node_data.get("value")

        return jsonify({"message": "Vetor atualizado com sucesso", "data": storageVector.to_dict()}), 200
    except Exception as e:
        return json_error(str(e))


# ===== ROTA PARA EXECUTAR O ALGORITMO DE ORDENAÇÃO (EXEMPLO COM INSERTION SORT) =====

@app.route("/insertion-sort", methods=["POST"])
def insertion_sort():
    """Executa insertion sort sobre o vetor atual e retorna todos os passos
    para a animação, sem alterar o vetor armazenado no servidor."""
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

        # Retornar steps e o estado final baseado na cópia do sorter
        # (não mutamos storageVector aqui).
        final = sorter.final_state()

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


# ===== ROTAS PARA GERENCIAR A PILHA =====

@app.route("/create_stack", methods=["POST"])
def create_stack():
    """Cria uma pilha vazia com o tamanho informado, descartando a anterior."""
    data = request.json
    if not data or "value" not in data:
        return json_error("Campo 'value' é obrigatório")

    try:
        size = parse_int(data.get("value"), name='value')
    except ValueError as exc:
        return json_error(str(exc))

    nodes = storageStack.create_stack(
        size=size,
        position=data.get("position")
    )

    global last_stack_steps
    last_stack_steps = {"op": None, "steps": []}

    return jsonify([node.to_dict() for node in nodes]), 201


@app.route("/stack_data", methods=["GET"])
def get_stack_data():
    """Retorna toda a estrutura da pilha (nós + edges + topo)."""
    return jsonify(storageStack.to_dict())


@app.route("/clear_stack", methods=["POST"])
def clear_stack():
    """Limpa a pilha, como se ela nunca tivesse sido criada (inclusive o tamanho)."""
    storageStack.clear()

    global last_stack_steps
    last_stack_steps = {"op": None, "steps": []}

    return jsonify({"message": "Pilha limpa com sucesso"}), 200


@app.route("/stack_push_steps", methods=["POST"])
def stack_push_steps():
    """Executa push e retorna todos os passos para a simulação passo a passo."""
    data = request.json
    if not data or "value" not in data:
        return jsonify({"success": False, "error": "Campo 'value' é obrigatório"}), 400

    if not storageStack.nodes:
        return jsonify({"success": False, "error": "Nenhuma pilha foi criada. Chame /create_stack primeiro."}), 400

    value = data.get("value")
    value_type = None

    if is_integer(value):
        value = int(value)
        value_type = 'int'
    elif is_single_char(value):
        value = str(value).upper()
        value_type = 'string'
    else:
        return jsonify({"success": False, "error": "O valor deve ser uma única letra ou um inteiro"}), 400

    current_type = storageStack.get_stack_data_type()
    if current_type and current_type != value_type:
        return jsonify({
            "success": False,
            "error": f"A pilha já contém valores do tipo '{current_type}'. Esvazie-a para trocar de tipo."
        }), 400

    if storageStack.top == len(storageStack.nodes) - 1:
        return jsonify({"success": False, "error": "Pilha cheia (Stack Overflow)"}), 400

    try:
        ops = StackOperations(storageStack)
        steps = ops.push(value)
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    global last_stack_steps
    last_stack_steps = {"op": "push", "steps": steps}

    return jsonify({"success": True, "steps": steps, "data": ops.final_state()}), 200


@app.route("/stack_pop_steps", methods=["POST"])
def stack_pop_steps():
    """Executa pop e retorna todos os passos para a simulação passo a passo."""
    if not storageStack.nodes:
        return jsonify({"success": False, "error": "Nenhuma pilha foi criada. Chame /create_stack primeiro."}), 400

    if storageStack.top == -1:
        return jsonify({"success": False, "error": "Pilha vazia (Stack Underflow)"}), 400

    try:
        ops = StackOperations(storageStack)
        steps = ops.pop()
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    global last_stack_steps
    last_stack_steps = {"op": "pop", "steps": steps}

    return jsonify({"success": True, "steps": steps, "data": ops.final_state()}), 200


@app.route("/stack_steps", methods=["GET"])
def get_stack_steps():
    """Retorna os últimos passos gerados (push ou pop), usado pela janela do CodeView."""
    return jsonify(last_stack_steps), 200


@app.route("/update_stack", methods=["POST"])
def update_stack():
    """Atualiza a pilha com o estado final (após push/pop)."""
    data = request.json
    if not data or "nodes" not in data:
        return json_error("Campo 'nodes' é obrigatório")

    try:
        nodes_data = data.get("nodes", [])
        for idx, node_data in enumerate(nodes_data):
            if idx < len(storageStack.nodes):
                storageStack.nodes[idx].value = node_data.get("value")

        if "top" in data:
            storageStack.top = data.get("top")

        return jsonify({"message": "Pilha atualizada com sucesso", "data": storageStack.to_dict()}), 200
    except Exception as e:
        return json_error(str(e))


if __name__ == "__main__":
    app.run(port=5000, debug=True)
