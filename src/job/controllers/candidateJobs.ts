import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response, RestController } from '@libs/boat';
import { CandidateJobsService } from '@app/job/providers';
import { Auth } from '@app/auth/decorators/auth';
import {
  ApplicationDetailTransformer,
  JobDetailTransformer,
} from '@app/transformer';

@Auth('candidate')
@Controller('candidate/jobs')
export class CandidateJobsController extends RestController {
  constructor(private candidateJobsService: CandidateJobsService) {
    super();
  }

  @Get('')
  async jobs(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const jobs = await this.candidateJobsService.jobs(req.all(), req.user);
    return res.success(
      await this.collection(jobs, new JobDetailTransformer(), { req }),
    );
  }

  @Get('applications')
  async applications(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const applications = await this.candidateJobsService.applications(
      req.all(),
      req.user,
    );
    return res.success(
      await this.collection(applications, new ApplicationDetailTransformer(), {
        req,
      }),
    );
  }

  @Get(':id')
  async job(@Req() req: Request, @Res() res: Response): Promise<Response> {
    let job = await this.candidateJobsService.job(req.all(), req.user);
    return res.success(
      await this.transform(job, new JobDetailTransformer(), { req }),
    );
  }

  @Post(':id/apply')
  async apply(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const application = await this.candidateJobsService.apply(
      req.all(),
      req.user,
    );
    return res.success(
      await this.transform(application, new ApplicationDetailTransformer(), {
        req,
      }),
    );
  }
}
