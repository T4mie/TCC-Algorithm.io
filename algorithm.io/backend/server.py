from flask import Flask, jsonify, request
from structures.SLL import SLL
from structures.Vector import Vector
from structures.ArrayVector import ArrayVector
from structures.Queue import Queue
from structures.Stack import Stack
from algorithms.insertion_sort import InsertionSort
from algorithms.merge_sort import MergeSort
from algorithms.stack_operations import StackOperations
from algorithms.queue_operations import QueueOperations
from algorithms.sll_operations import SLLOperations
from algorithms.array_operations import ArrayOperations
from services.utils import is_single_char, is_integer

# ===== CONFIGURAÇÃO DA APLICAÇÃO =====
app = Flask(__name__)
storageSLL = SLL()
storageVector = Vector()
storageArrayVector = ArrayVector()
storageMergeSort = Vector()
storageQueue = Queue()
storageStack = Stack()


@app.after_request
def add_cors_headers(response):
    """Libera chamadas cross-origin: o renderer do Electron carrega a UI via
    file:// (origem 'null'), então o navegador bloqueia fetch/XHR para
    http://localhost:5000 sem esses cabeçalhos."""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    """Responde ao preflight OPTIONS enviado pelo navegador antes de
    requisições POST com corpo JSON."""
    return '', 204

# Guarda os últimos passos gerados (push ou pop) para que a janela filha do
# CodeView possa buscá-los via GET sem precisar reenviar o valor empilhado.
last_stack_steps = {"op": None, "steps": []}

# Idem para a fila (enqueue/dequeue).
last_queue_steps = {"op": None, "steps": []}

# Idem para a lista simplesmente ligada (insert_first/insert_last/remove_first/remove_last).
last_sll_steps = {"op": None, "steps": []}

# Idem para o vetor de capacidade fixa (insert_at/remove_at).
last_array_steps = {"op": None, "steps": []}


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


# ===== ROTAS PARA GERENCIAR A LISTA SIMPLESMENTE LIGADA =====

def _apply_sll_ops(ops):
    """Efetiva no storageSLL real o resultado (já calculado sobre uma cópia)
    de uma simulação de insert/remove."""
    storageSLL.nodes = ops.nodes
    storageSLL.edges = ops.edges
    storageSLL.head = ops.head
    storageSLL.tail = ops.tail
    storageSLL.size = ops.size
    storageSLL.node_counter = ops.node_counter
    storageSLL.list_node = ops.list_node


@app.route("/SLL_data", methods=["GET"])
def get_all_data():
    """Retorna toda a estrutura da lista encadeada (nós + edges)."""
    return jsonify(storageSLL.to_dict())


@app.route("/clear_sll", methods=["POST"])
def clear_sll():
    """Limpa a lista, como se ela nunca tivesse sido usada."""
    storageSLL.clear()

    global last_sll_steps
    last_sll_steps = {"op": None, "steps": []}

    return jsonify({"message": "Lista limpa com sucesso"}), 200


@app.route("/sll_insert_last_steps", methods=["POST"])
def sll_insert_last_steps():
    """Executa insert_last e retorna todos os passos para a simulação passo a passo."""
    data = request.json
    if not data or "value" not in data:
        return jsonify({"success": False, "error": "Campo 'value' é obrigatório"}), 400
    if not is_single_char(data.get("value")):
        return jsonify({"success": False, "error": "O valor deve ser uma única letra (a-z, A-Z)"}), 400

    value = str(data.get("value")).upper()

    try:
        ops = SLLOperations(storageSLL)
        steps = ops.insert_last(value, position=data.get("position"), label=value)
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    _apply_sll_ops(ops)

    global last_sll_steps
    last_sll_steps = {"op": "insert_last", "steps": steps}

    return jsonify({"success": True, "steps": steps, "data": ops.final_state()}), 200


@app.route("/sll_insert_first_steps", methods=["POST"])
def sll_insert_first_steps():
    """Executa insert_first e retorna todos os passos para a simulação passo a passo."""
    data = request.json
    if not data or "value" not in data:
        return jsonify({"success": False, "error": "Campo 'value' é obrigatório"}), 400
    if not is_single_char(data.get("value")):
        return jsonify({"success": False, "error": "O valor deve ser uma única letra (a-z, A-Z)"}), 400

    value = str(data.get("value")).upper()

    try:
        ops = SLLOperations(storageSLL)
        steps = ops.insert_first(value, position=data.get("position"), label=value)
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    _apply_sll_ops(ops)

    global last_sll_steps
    last_sll_steps = {"op": "insert_first", "steps": steps}

    return jsonify({"success": True, "steps": steps, "data": ops.final_state()}), 200


@app.route("/sll_remove_first_steps", methods=["POST"])
def sll_remove_first_steps():
    """Executa remove_first e retorna todos os passos para a simulação passo a passo."""
    if storageSLL.head is None:
        return jsonify({"success": False, "error": "A lista está vazia"}), 400

    try:
        ops = SLLOperations(storageSLL)
        steps = ops.remove_first()
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    _apply_sll_ops(ops)

    global last_sll_steps
    last_sll_steps = {"op": "remove_first", "steps": steps}

    return jsonify({"success": True, "steps": steps, "data": ops.final_state()}), 200


@app.route("/sll_remove_last_steps", methods=["POST"])
def sll_remove_last_steps():
    """Executa remove_last e retorna todos os passos para a simulação passo a passo."""
    if storageSLL.tail is None:
        return jsonify({"success": False, "error": "A lista está vazia"}), 400

    try:
        ops = SLLOperations(storageSLL)
        steps = ops.remove_last()
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    _apply_sll_ops(ops)

    global last_sll_steps
    last_sll_steps = {"op": "remove_last", "steps": steps}

    return jsonify({"success": True, "steps": steps, "data": ops.final_state()}), 200


@app.route("/sll_steps", methods=["GET"])
def get_sll_steps():
    """Retorna os últimos passos gerados (insert/remove), usado pela janela do CodeView."""
    return jsonify(last_sll_steps), 200


# ===== ROTAS PARA GERENCIAR O VETOR DE CAPACIDADE FIXA =====

@app.route("/array_create", methods=["POST"])
def array_create():
    """Cria um vetor vazio com a capacidade informada, descartando o anterior."""
    data = request.json
    if not data or "value" not in data:
        return json_error("Campo 'value' é obrigatório")

    try:
        capacity = parse_int(data.get("value"), name='value')
    except ValueError as exc:
        return json_error(str(exc))

    nodes = storageArrayVector.create_array(
        capacity=capacity,
        position=data.get("position")
    )

    global last_array_steps
    last_array_steps = {"op": None, "steps": []}

    return jsonify([node.to_dict() for node in nodes]), 201


@app.route("/array_data", methods=["GET"])
def get_array_data():
    """Retorna toda a estrutura do vetor (nós + edges + tamanho)."""
    return jsonify(storageArrayVector.to_dict())


@app.route("/clear_array", methods=["POST"])
def clear_array():
    """Limpa o vetor, como se ele nunca tivesse sido criado (inclusive a capacidade)."""
    storageArrayVector.clear()

    global last_array_steps
    last_array_steps = {"op": None, "steps": []}

    return jsonify({"message": "Vetor limpo com sucesso"}), 200


@app.route("/array_insert_steps", methods=["POST"])
def array_insert_steps():
    """Executa insert_at e retorna todos os passos para a simulação passo a passo."""
    data = request.json
    if not data or "value" not in data or "index" not in data:
        return jsonify({"success": False, "error": "Campos 'index' e 'value' são obrigatórios"}), 400

    if not storageArrayVector.nodes:
        return jsonify({"success": False, "error": "Nenhum vetor foi criado. Chame /array_create primeiro."}), 400

    try:
        index = parse_int(data.get("index"), name='index')
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    value = data.get("value")
    if is_integer(value):
        value = int(value)
        value_type = 'int'
    elif is_single_char(value):
        value = str(value).upper()
        value_type = 'string'
    else:
        return jsonify({"success": False, "error": "O valor deve ser uma única letra ou um inteiro"}), 400

    current_type = storageArrayVector.get_array_data_type()
    if current_type and current_type != value_type:
        return jsonify({
            "success": False,
            "error": f"O vetor já contém valores do tipo '{current_type}'. Esvazie-o para trocar de tipo."
        }), 400

    try:
        ops = ArrayOperations(storageArrayVector)
        steps = ops.insert_at(index, value)
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    global last_array_steps
    last_array_steps = {"op": "insert", "steps": steps}

    return jsonify({"success": True, "steps": steps, "data": ops.final_state()}), 200


@app.route("/array_remove_steps", methods=["POST"])
def array_remove_steps():
    """Executa remove_at e retorna todos os passos para a simulação passo a passo."""
    data = request.json
    if not data or "index" not in data:
        return jsonify({"success": False, "error": "Campo 'index' é obrigatório"}), 400

    if not storageArrayVector.nodes:
        return jsonify({"success": False, "error": "Nenhum vetor foi criado. Chame /array_create primeiro."}), 400

    try:
        index = parse_int(data.get("index"), name='index')
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    try:
        ops = ArrayOperations(storageArrayVector)
        steps = ops.remove_at(index)
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400

    global last_array_steps
    last_array_steps = {"op": "remove", "steps": steps}

    return jsonify({"success": True, "steps": steps, "data": ops.final_state()}), 200


@app.route("/array_steps", methods=["GET"])
def get_array_steps():
    """Retorna os últimos passos gerados (insert/remove), usado pela janela do CodeView."""
    return jsonify(last_array_steps), 200


@app.route("/update_array", methods=["POST"])
def update_array():
    """Atualiza o vetor com o estado final (após insert_at/remove_at)."""
    data = request.json
    if not data or "nodes" not in data:
        return json_error("Campo 'nodes' é obrigatório")

    try:
        nodes_data = data.get("nodes", [])
        for idx, node_data in enumerate(nodes_data):
            if idx < len(storageArrayVector.nodes):
                storageArrayVector.nodes[idx].value = node_data.get("value")
                storageArrayVector.nodes[idx].label = node_data.get("label")

        if "size" in data:
            storageArrayVector.size = data.get("size")

        return jsonify({"message": "Vetor atualizado com sucesso", "data": storageArrayVector.to_dict()}), 200
    except Exception as e:
        return json_error(str(e))


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


# ===== ROTAS PARA O VETOR E O ALGORITMO DE ORDENAÇÃO MERGE SORT =====
# Storage próprio (`storageMergeSort`), independente do vetor do Insertion
# Sort, ainda que reaproveitando a mesma classe `Vector` como scratch pad.

@app.route("/mergesort_create", methods=["POST"])
def mergesort_create():
    """Cria um vetor vazio com o tamanho informado, descartando o anterior."""
    data = request.json
    if not data or "value" not in data:
        return json_error("Campo 'value' é obrigatório")

    try:
        size = parse_int(data.get("value"), name='value')
    except ValueError as exc:
        return json_error(str(exc))

    nodes = storageMergeSort.create_vector(
        size=size,
        position=data.get("position")
    )
    return jsonify([node.to_dict() for node in nodes]), 201


@app.route("/mergesort_insert", methods=["POST"])
def mergesort_insert():
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

    if is_integer(value):
        value = int(value)
        value_type = 'int'
    elif is_single_char(value):
        value = str(value).upper()
        value_type = 'string'
    else:
        return json_error("O valor deve ser uma única letra ou um inteiro")

    current_type = storageMergeSort.get_vector_data_type()
    reset_happened = False

    if current_type and current_type != value_type and storageMergeSort.nodes:
        size = len(storageMergeSort.nodes)
        storageMergeSort.create_vector(size)
        reset_happened = True

    try:
        storageMergeSort.insert_value(node_id, value)
        response = {"message": "Valor inserido com sucesso"}
        if reset_happened:
            response["reset"] = True
            response["info"] = "Vetor foi resetado pois você inseriu um tipo de dado diferente"
        return jsonify(response), 200
    except Exception as e:
        return json_error(str(e))


@app.route("/mergesort_data", methods=["GET"])
def get_mergesort_data():
    """Retorna toda a estrutura do vetor (nós + edges)."""
    return jsonify(storageMergeSort.to_dict())


@app.route("/clear_mergesort", methods=["POST"])
def clear_mergesort():
    """Limpa o vetor, como se ele nunca tivesse sido criado (inclusive o tamanho)."""
    storageMergeSort.clear()
    return jsonify({"message": "Vetor limpo com sucesso"}), 200


@app.route("/update_mergesort", methods=["POST"])
def update_mergesort():
    """Atualiza o vetor com o estado final (após ordenação)."""
    data = request.json
    if not data or "nodes" not in data:
        return json_error("Campo 'nodes' é obrigatório")

    try:
        nodes_data = data.get("nodes", [])
        for idx, node_data in enumerate(nodes_data):
            if idx < len(storageMergeSort.nodes):
                storageMergeSort.nodes[idx].value = node_data.get("value")

        return jsonify({"message": "Vetor atualizado com sucesso", "data": storageMergeSort.to_dict()}), 200
    except Exception as e:
        return json_error(str(e))


@app.route("/merge-sort", methods=["POST"])
def merge_sort():
    """Executa merge sort sobre o vetor atual e retorna todos os passos para
    a animação (divisão recursiva + mesclagem), sem alterar o vetor
    armazenado no servidor."""
    try:
        if not storageMergeSort.nodes:
            return jsonify({
                "success": False,
                "error": "Nenhum vetor foi criado. Chame /mergesort_create primeiro."
            }), 400

        data_indices = [i for i, node in enumerate(storageMergeSort.nodes)
                         if node.value is not None]
        if not data_indices:
            return jsonify({
                "success": False,
                "error": "O vetor está vazio. Insira valores com /mergesort_insert."
            }), 400

        sorter = MergeSort(storageMergeSort)
        steps = sorter.sort()
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
        app.logger.error(f"Erro inesperado em merge-sort: {e}")
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
