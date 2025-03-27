import {$host} from "./index";

export const fetchPositions = async () => {
    const response = await $host.get('api/position');
    return response;
}

export const createPosition = async (name) => {
    const response = await $host.post('api/position', { name });
    return response;
}

export const updatePosition = async (id, name) => {
    const response = await $host.put(`api/position/${id}`, { name });
    return response;
}