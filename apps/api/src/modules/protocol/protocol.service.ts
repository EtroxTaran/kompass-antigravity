import { Injectable, NotFoundException } from '@nestjs/common';
import { ProtocolRepository } from './protocol.repository';
import { Protocol } from '@kompass/shared';
import { CreateProtocolDto, UpdateProtocolDto } from './dto/protocol.dto';

@Injectable()
export class ProtocolService {
  constructor(private readonly protocolRepository: ProtocolRepository) { }

  async create(
    createProtocolDto: CreateProtocolDto,
    userId: string,
  ): Promise<Protocol> {
    const protocol: Protocol = {
      _id: `protocol-${Date.now()}`,
      type: 'protocol',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: userId,
      modifiedBy: userId,
      version: 1,
      ...createProtocolDto,
    };
    return this.protocolRepository.create(protocol, userId);
  }

  async findAll(params?: {
    customerId?: string;
    projectId?: string;
  }): Promise<Protocol[]> {
    if (params?.customerId || params?.projectId) {
      const selector: Record<string, string> = {};
      if (params.customerId) selector.customerId = params.customerId;
      if (params.projectId) selector.projectId = params.projectId;
      return (await this.protocolRepository.findBySelector(selector)).data;
    }
    return (await this.protocolRepository.findAll()).data;
  }

  async findOne(id: string): Promise<Protocol> {
    const protocol = await this.protocolRepository.findById(id);
    if (!protocol) {
      throw new NotFoundException(`Protocol with ID ${id} not found`);
    }
    return protocol;
  }

  async update(
    id: string,
    updateProtocolDto: UpdateProtocolDto,
    userId: string,
  ): Promise<Protocol> {
    return this.protocolRepository.update(id, updateProtocolDto, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    return this.protocolRepository.delete(id, userId);
  }
}
