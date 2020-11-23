class ItemHandler {
  constructor(monday) {
    this.monday = monday;
    this.draggedItem = null;
    this.events = [];
  }

  setDraggedItem(draggedItem) {
    this.draggedItem = draggedItem;
  }

  getDraggedItem() {
    return this.draggedItem;
  }

  openItem(item) {
    this.monday.execute('openItemCard', { itemId: item.id, kind: "updates" });
  }

  addEvent(event) {
    this.events.push(event);
  }

  getEvents() {
    return this.events;
  }
}

export default ItemHandler;
