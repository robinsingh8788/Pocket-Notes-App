
export function getGroups() {
  const data = localStorage.getItem("note-groups");
  return data ? JSON.parse(data) : [];
}

export function saveGroups(groups) {
  localStorage.setItem("note-groups", JSON.stringify(groups));
}

export function getNotes(groupName) {
  const data = localStorage.getItem(`notes-${groupName}`);
  return data ? JSON.parse(data) : [];
}

export function saveNotes(groupName, notes) {
  localStorage.setItem(`notes-${groupName}`, JSON.stringify(notes));
}
