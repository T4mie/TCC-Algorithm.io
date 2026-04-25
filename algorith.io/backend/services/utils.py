def is_single_char(value):
    """Verifica se o valor é um único caractere válido (a-z, A-Z, 0-9)"""
    if not isinstance(value, str):
        return False
    # aceitar apenas letras (a-z, A-Z)
    return len(value) == 1 and value.isalnum()

def is_integer(value):
    """Verifica se o valor é um inteiro válido"""
    if isinstance(value, bool):  # bool é subclasse de int em Python
        return False
    return isinstance(value, int) or (isinstance(value, str) and value.isdigit())