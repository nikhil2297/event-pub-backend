import { CreateChannelDTO } from "../../../domain/dtos/CreateChannelDTO";
import { CreateProjectDTO } from "../../../domain/dtos/CreatePorjectDTO";
import { OnboardingProjectDTO } from "../../../domain/dtos/OnboardinProjectDTO";
import { ProjectModel } from "../../../infrastructure/adapters/output/schemas/ProjectSchema";
import { ApiKeyService } from "../../../infrastructure/services/ApiService";
import { ValidationError, ConnectionError } from "../../../shared/errors/ApplicationError";
import { Logger } from "../../../shared/utils/Logger";
import { IApiKeyRespository } from "../../ports/repository/IApiKeyRespository";
import { IChannelRepository } from "../../ports/repository/IChannelRepository";
import { IProjectRepository } from "../../ports/repository/IProjectRepository";
import { ProjectValidator } from "../../validators/ProjectValidator";

export class OnboardProjectUseCase {
    constructor(private readonly projectRepository: IProjectRepository, private readonly channelRespository : IChannelRepository,
        private readonly apiKeyRepository : IApiKeyRespository
    ) {}
        
        async execute(data: OnboardingProjectDTO, userIdentifier: string) {
            ProjectValidator.validateOnboardProject(data);
    
            const existingProject = await ProjectModel.findOne({
                name: data.project,
                owner: userIdentifier
            });

            const projectDto : CreateProjectDTO = {
                name: data.project,
                owner: userIdentifier,
                members: [{
                    identifier: userIdentifier,
                    scope: 'ADMIN',
                    pending: false
                }]
            }
            
    
            if(existingProject) {
                Logger.error('Project already exists:', existingProject);
                throw new ValidationError(`Project with ${data.project} already exists in your account`);
            }
    
            try {
                const token = ApiKeyService.createApiKey(32);
                const project = await this.projectRepository.create(projectDto);

                const projectId = project._id;

                const channelDto : CreateChannelDTO = {
                    name: data.channel,
                    icon:  data.icon,
                }

                const channelData = await this.channelRespository.create(channelDto, projectId, userIdentifier);
                

                const tokenData = await this.apiKeyRepository.createToken({
                    projectId: projectId,
                    token: token
                })  

                return {
                    project: project,
                    channel: channelData,
                    token: tokenData
                }


            } catch (error) {
                throw new ConnectionError('Failed to onboard project');
            }
        }
           
}