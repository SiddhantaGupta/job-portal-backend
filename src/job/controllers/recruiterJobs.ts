import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response, RestController } from '@libs/boat';
import { RecruiterJobsService } from '@app/job/providers';
import { Auth } from '@app/auth/decorators/auth';
import {
  ApplicationDetailTransformer,
  JobDetailTransformer,
} from '@app/transformer';

@Auth('recruiter')
@Controller('recruiter/jobs')
export class RecruiterJobsController extends RestController {
  constructor(private recruiterJobsService: RecruiterJobsService) {
    super();
  }

  @Get('')
  async jobs(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const jobs = await this.recruiterJobsService.jobs(req.all(), req.user);
    return res.success(
      await this.collection(jobs, new JobDetailTransformer(), { req }),
    );
  }

  @Post('')
  async postJob(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const job = await this.recruiterJobsService.postJob(req.all(), req.user);
    return res.success(
      await this.transform(job, new JobDetailTransformer(), { req }),
    );
  }

  @Get(':id')
  async job(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const job = await this.recruiterJobsService.job(req.all(), req.user);
    return res.success(
      await this.transform(job, new JobDetailTransformer(), { req }),
    );
  }

  @Get(':id/applications')
  async applications(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const applications = await this.recruiterJobsService.applications(
      req.all(),
      req.user,
    );
    return res.success(
      await this.collection(applications, new ApplicationDetailTransformer(), {
        req,
      }),
    );
  }
}
