import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response, RestController } from '@libs/boat';
import { CandidateJobsService } from '@app/job/providers';
import { Auth } from '@app/auth/decorators/auth';
import {
  ApplicationDetailTransformer,
  JobDetailTransformer,
} from '@app/transformer';
import { ApplicationDto, JobIdDto } from '../dtos';
import {
  IApplicationSearchModel,
  IJobSearchModel,
  IPagination,
} from '../interfaces';

@Auth('candidate')
@Controller('candidate/jobs')
export class CandidateJobsController extends RestController {
  constructor(private candidateJobsService: CandidateJobsService) {
    super();
  }

  @Get('')
  async getJobs(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const jobs = await this.candidateJobsService.getJobs(
      req.all() as IJobSearchModel,
      req.user,
    );
    return res.withMeta(
      await this.paginate(jobs, new JobDetailTransformer(), { req }),
    );
  }

  @Get('applications')
  async getApplications(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const applications = await this.candidateJobsService.getApplications(
      req.all() as IApplicationSearchModel,
      req.user,
    );
    return res.withMeta(
      await this.paginate(applications, new ApplicationDetailTransformer(), {
        req,
      }),
    );
  }

  @Get(':id')
  async getJobById(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    let job = await this.candidateJobsService.getJobById(
      req.all() as JobIdDto,
      req.user,
    );
    return res.success(
      await this.transform(job, new JobDetailTransformer(), { req }),
    );
  }

  @Post('apply')
  async applyToJob(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    return res.success(
      await this.candidateJobsService.applyToJob(
        req.all() as ApplicationDto,
        req.user,
      ),
      201,
    );
  }
}
