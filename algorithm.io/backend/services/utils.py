"""Utilitários de validação usados pelo backend.

Este módulo contém funções de validação que podem ser reutilizadas por
rotas e serviços sem duplicar lógica no aplicativo.
"""


def is_single_char(value):
    """Verifica se o valor é um único caractere válido.

    Retorna True apenas quando o valor é uma string de tamanho 1 e contém apenas
    caracteres alfanuméricos.
    """
    if not isinstance(value, str):
        return False
    # aceitar apenas letras (a-z, A-Z)
    return len(value) == 1 and value.isalnum()


def is_integer(value):
    """Verifica se o valor é um inteiro válido"""
    if isinstance(value, bool):  # bool é subclasse de int em Python
        return False
    return isinstance(value, int) or (isinstance(value, str) and value.isdigit())