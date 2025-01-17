import { Request, Response, NextFunction } from "express";
import { ChannelRepository } from "../../output/repositories/ChannelRepository";
import { CreateChannelUseCase } from "../../../../application/usecases/channel/CreateChannelUseCase";
import { ResponseFormatter } from "../../../../shared/utils/ResponseFormatter";
import { DeleteChannelUseCase } from "../../../../application/usecases/channel/DeleteChannelUseCase";
import { UpdateSettingsUseCase } from "../../../../application/usecases/channel/UpdateSettingsUseCase";
import { AllChannelUseCase } from "../../../../application/usecases/channel/AllChannelUseCase";

export class ChannelController {
    constructor(private readonly channelRepository: ChannelRepository) {}

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new CreateChannelUseCase(this.channelRepository);
            const projectId = req.params.projectId;
            const channel = await usecase.execute(req.body.data, projectId, req.body.user.userId);

            res.json(ResponseFormatter.success(channel, 'Channel created successfully'));
        }catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new DeleteChannelUseCase(this.channelRepository);
            await usecase.execute(req.body.channelName, req.body.projectName, req.body.user.userId);

            res.json(ResponseFormatter.success({}, 'Channel deleted successfully'));
        }catch (error) {
            next(error);
        }
    }

    async updateSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new UpdateSettingsUseCase(this.channelRepository);
            await usecase.execute(req.body.channelName, req.body.projectName, req.body.user.userId, req.body.settings);

            res.json(ResponseFormatter.success({}, 'Channel settings updated successfully'));
        }catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new AllChannelUseCase(this.channelRepository);
            
            const channels = usecase.execute(req.body.projectName, req.body.user.userId);

            res.json(ResponseFormatter.success(channels, 'Channels fetched successfully'));
        }catch (error) {
            next(error);
        }
    }
}