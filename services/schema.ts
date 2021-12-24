
import { FieldType } from "rich/blocks/table-store/schema/field.type";
import { TableSchema } from "rich/blocks/table-store/schema/meta";
import { BaseService } from "../net";
import { Sock } from "../net/sock";
import { FileType } from "../type";

class SchemaService extends BaseService {
    async create(sock: Sock, data: { text?: string, templateId?: string }) {
        var result = await sock.put<{ schema: Partial<TableSchema> }, string>('/schema/crate', data || {});
        return result.data?.schema;
    }
    async load(sock: Sock, schemaId: string) {
        var result = await sock.get<{ schema: Partial<TableSchema> }, string>('/schema/load', { id: schemaId });
        return result.data?.schema;
    }
    async addField(sock: Sock, schemaId: string, options: { type: FieldType, text: string }) {
        var result = await sock.post<{ field: Partial<FileType> }, string>('/schema/field/add', {
            id: schemaId,
            type: options.type,
            text: options.text
        });
        return result.data;
    }
    async removeField(sock: Sock, schemaId: string, fieldId: string) {
        return (await sock.post<{ ok: boolean }, string>('/schema/field/remove', {
            id: schemaId,
            fieldId
        })).data
    }
    async updateField(sock: Sock, schemaId: string, fieldId: string, data: Record<string, any>) {
        return (await sock.post<{ ok: boolean }, string>('/schema/field/update', {
            id: schemaId,
            fieldId,
            data
        })).data
    }
    async turnField(sock: Sock, schemaId: string, fieldId: string, newType: FieldType) {
        return (await sock.post<{ ok: boolean }, string>('/schema/field/turn', {
            id: schemaId,
            fieldId
        })).data;
    }
    //#region /schema/table
    async tableAllQuery(sock: Sock, schemaId: string, options: { filter?: Record<string, any> }) {
        var result = await sock.get<{ list: any[], total: number }, string>('/schema/table/query/all', {
            schemaId: schemaId,
            filter: options.filter
        });
        return result.data;
    }
    async tableQuery(sock: Sock, schemaId: string, options: { page?: number, size?: number, filter?: Record<string, any> }) {
        var result = await sock.get<{ list: any[], total: number }, string>('/schema/table/query', {
            schemaId: schemaId,
            page: options.page,
            size: options.size,
            filter: options.filter
        });
        return result.data;
    }
    async tableInsertRow(sock: Sock, schemaId: string, data: Record<string, any>, pos?: { id: string, pos: "down" | 'up' }) {
        return (await sock.post<Record<string, any>, string>('/schema/table/add', {
            schemaId: schemaId,
            data
        })).data;
    }
    async tableRemoveRow(sock: Sock, schemaId: string, id: string) {
        return (await sock.post<{ ok: boolean }, string>('/schema/table/remove', {
            schemaId: schemaId,
            id
        })).data;
    }
    async tableUpdateRow(sock: Sock, schemaId: string, id: string, data: Record<string, any>) {
        return (await sock.post<{ ok: boolean }, string>('/schema/table/update', {
            schemaId: schemaId,
            id,
            data
        })).data;
    }
    //#endregion
}
export var schemaService = new SchemaService()