import { Request, Response, NextFunction } from "express";
import { IChannelEventRepository } from "../../../../application/ports/repository/IChannelEventRepository";
import { CreateChannelEventUseCase } from "../../../../application/usecases/channelEvent/CreateChannelEventUseCase";
import { ResponseFormatter } from "../../../../shared/utils/ResponseFormatter";
import { GetChannelEventUseCase } from "../../../../application/usecases/channelEvent/GetChannelEventUseCase";
import { FilterChannelEventsUseCase } from "../../../../application/usecases/channelEvent/FilterChannelEventsUseCase";
import { DeleteChannelEventUseCase } from "../../../../application/usecases/channelEvent/DeleteChannelEventUseCase";

export class ChannelEventController {
    constructor(private readonly channelEventRepository: IChannelEventRepository) {
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new CreateChannelEventUseCase(this.channelEventRepository);
            const eventData = req.body.data;
            const projectId = req.body.projectId;
            const userIdentifier = req.body.user.userIdentifier;
            const channelEvent = usecase.execute(eventData, projectId);

            res.json(ResponseFormatter.success(channelEvent, 'Event created successfully'));
        }catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new GetChannelEventUseCase(this.channelEventRepository);
            const channelName = req.params.channel;
            const channelEvents = usecase.execute(channelName, req.body.projectId);

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