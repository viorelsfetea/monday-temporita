class ItemHandler {
  constructor() {
    this.draggedItem = null;
    this.events = [];
  }

  setDraggedItem(draggedItem) {
    this.draggedItem = draggedItem;
  }

  getDraggedItem() {
    return this.draggedItem;
  }

  addEvent(event) {
    this.events.push(event);
  }

  getEvents() {
    return this.events;
  }
}

export default ItemHandler;