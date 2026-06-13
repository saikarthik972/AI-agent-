from datetime import datetime

class SharedMemory:
    def __init__(self):
        self.store = {}
        self.log = []

    def write(self, agent: str, key: str, value: str):
        self.store[key] = {
            "value": value,
            "by": agent,
            "at": datetime.now().isoformat()
        }
        self.log.append(f"[{agent}] wrote → {key}")

    def read(self, key: str) -> str:
        entry = self.store.get(key)
        return entry["value"] if entry else ""

    def all_context(self) -> str:
        if not self.store:
            return "No context yet."
        return "\n\n".join(
            f"[{k}] (by {v['by']}):\n{v['value'][:500]}"
            for k, v in self.store.items()
        )

    def get_log(self):
        return self.log

    def clear(self):
        self.store = {}
        self.log = []

memory = SharedMemory()
