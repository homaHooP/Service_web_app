import {api} from "./Client.js"

export async function getRequests() {
    return await api.get("/requests/all");
}
export async function getMyRequests() {
    return await api.get(`/requests/my`);
}
export async function getRequest(id) {
    return await api.get(`/requests/${id}`);
}
export async function getCategories() {
    return await api.get(`/categories`);
}
export async function addRequest(data) {
    return await api.post("/requests", data);
}
export async function updateRequestHistory(id, data) {
    return await api.post(`/requests/${id}/history`, data);
}
export async function deleteRequestHistory(requestId,index) {
    return await api.patch(`/requests/${requestId}/history/${index}`);
}
export async function updateRequestComments(id, data) {
    return await api.post(`/requests/${id}/comments`, data);
}
export async function updateRequestStatus(id,data) {
    return await api.patch(`/requests/${id}/status`, data);
}