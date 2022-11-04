import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response, RestController } from '@libs/boat';
import { RecruiterJobsService } from '@app/job/providers';
import { Auth } from '@app/auth/decorators/auth';
import {
  ApplicationDetailTransformer,
  JobDetailTransformer,
} from '@app/transformer';
import {
  IApplicationSearchModel,
  IJobModel,
  IJobSearchModel,
  IPagination,
} from '../interfaces';
import { JobIdDto, JobPostDto } from '../dtos';

@Auth('recruiter')
@Controller('recruiter/jobs')
export class RecruiterJobsController extends RestController {
  constructor(private recruiterJobsService: RecruiterJobsService) {
    super();
  }

  @Get('')
  async getJobs(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const jobs = await this.recruiterJobsService.getJobs(
      req.all() as IJobSearchModel,
      req.user,
    );
    return res.withMeta(
      await this.paginate(jobs, new JobDetailTransformer(), { req }),
    );
  }

  @Post('')
  async postJob(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const job = await this.recruiterJobsService.postJob(
      req.all() as JobPostDto,
      req.user,
    );
    return res.success(
      await this.transform(job, new JobDetailTransformer(), { req }),
    );
  }

  @Get(':id')
  async getJobById(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const job = await this.recruiterJobsService.getJobById(
      req.all() as JobIdDto,
      req.user,
    );
    return res.success(
      await this.transform(job, new JobDetailTransformer(), { req }),
    );
  }

  @Get(':id/applications')
  async getApplicationsForJob(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const applications = await this.recruiterJobsService.getApplicationsForJob(
      req.all() as IApplicationSearchModel,
      req.user,
    );
    return res.withMeta(
      await this.paginate(applications, new ApplicationDetailTransformer(), {
        req,
      }),
    );
  }
}
