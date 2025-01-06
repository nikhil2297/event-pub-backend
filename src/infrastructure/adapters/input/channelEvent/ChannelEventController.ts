import { Request, Response, NextFunction } from "express";
import { IChannelEventRepository } from "../../../../application/ports/repository/IChannelEventRepository";
import { CreateChannelEventUseCase } from "../../../../application/usecases/channelEvent/CreateChannelEventUseCase";
import { ResponseFormatter } from "../../../../shared/utils/ResponseFormatter";
import { GetChannelEventUseCase } from "../../../../application/usecases/channelEvent/GetChannelEventUseCase";
import { FilterChannelEventsUseCase } from "../../../../application/usecases/channelEvent/FilterChannelEventsUseCase";
import { DeleteChannelEventUseCase } from "../../../../application/usecases/channelEvent/DeleteChannelEventUseCase";
import { GetAllChannelEventUseCase } from "../../../../application/usecases/channelEvent/AllChannelEventUseCase";
import { ValidationError } from "../../../../shared/errors/ApplicationError";

export class ChannelEventController {
    constructor(private readonly channelEventRepository: IChannelEventRepository) {
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new CreateChannelEventUseCase(this.channelEventRepository);
            const {projectId} = req.params;
            const eventData = req.body.data;
            // const userIdentifier = req.body.user.userId;
            const channelEvent = await usecase.execute(eventData, projectId);

            res.json(ResponseFormatter.success(channelEvent, 'Event created successfully'));
        }catch (error) {
            next(error);
        }
    }

    async getChannelEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new GetChannelEventUseCase(this.channelEventRepository);
            const channelName = req.params.channel;
            const projectId = req.params.projectId;
            const channelEvents = await     usecase.execute(channelName, projectId);

            res.json(ResponseFormatter.success(channelEvents, 'Event fetched successfully'));
        } catch (error) {
            next(error);
        }
    }

    async getAllChannelEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new GetAllChannelEventUseCase(this.channelEventRepository);
            const projectId = req.params.projectId as string;

            if (!projectId) {
                throw new ValidationError('ProjectId is required');
            }

            const channelEvents = await usecase.execute(projectId);

            res.json(ResponseFormatter.success(channelEvents, 'Event fetched successfully'));
        } catch (error) {
            next(error);
        }
    }

    async filterEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new FilterChannelEventsUseCase(this.channelEventRepository);
            const channelName = req.params.channel;
            const projectId = req.body.projectId;
            const filter = req.query.filter as string;
            const channelEvents = usecase.execute(channelName, filter, projectId);

            res.json(ResponseFormatter.success(channelEvents, 'Event fetched successfully'));
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new DeleteChannelEventUseCase(this.channelEventRepository);
            const channelName = req.params.channel;
            const projectId = req.body.projectId;
            const channelEvents = usecase.execute(channelName, projectId);

            res.json(ResponseFormatter.success(channelEvents, 'Event deleted successfully'));
        } catch (error) {
            next(error);
        }
    }
}