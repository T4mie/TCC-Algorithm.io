#criação das ligações entre nós

class Edge:
    def __init__(self, source_id, target_id, edge_type="next"):
        self.source = source_id
        self.target = target_id
        self.type = edge_type
    
    def to_dict(self):
        return{
            "source": self.source,
            "target": self.target,
            "type": self.type
        }
    