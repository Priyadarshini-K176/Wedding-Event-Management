import axios from "axios";

const BASE = "http://localhost:5000/api/notes";

export const fetchNotesApi = () => axios.get(BASE);

export const createNoteApi = (data) => axios.post(BASE, data);

export const deleteNoteApi = (id) => axios.delete(`${BASE}/${id}`);
