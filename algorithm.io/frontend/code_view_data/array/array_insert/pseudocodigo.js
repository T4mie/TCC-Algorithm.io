export const arrayInsertPseudocodigoLines = [
  { id: 'SIGNATURE', text: 'INSERIR(Vetor, indice, valor)' },
  { id: 'CHECK_INDEX', text: '    se indice < 0 ou indice >= tamanho(Vetor)' },
  { id: 'INVALID_INDEX', text: '        erro "Índice inválido"' },
  { id: 'CHECK_FULL', text: '    se todos os slots estao preenchidos e Vetor[indice] == vazio' },
  { id: 'OVERFLOW', text: '        erro "Vetor cheio (Overflow)"' },
  { id: 'REPLACE_VALUE', text: '    Vetor[indice] = valor' },
  { id: 'SET_VALUE', text: '    Vetor[indice] = valor' },
  { id: 'INCREMENT_SIZE', text: '    tamanho = quantidade de slots preenchidos' }
];
