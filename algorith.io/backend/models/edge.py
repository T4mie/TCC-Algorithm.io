#criação das ligações entre nós

class Edge:
    def __init__(self, source_id, target_id, relation="next"):
        self.source = source_id
        self.target = target_id
        #para listas duplamente ligadas, se a ligação é next ou prev
        self.relation = relation 
    
    def to_dict(self):
        return{
            "source": self.source,
            "target": self.target,
            "relation": self.relation
        }
    