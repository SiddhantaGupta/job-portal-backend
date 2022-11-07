import { registerAs } from '@nestjs/config';

// all your application settings go here.
export default registerAs('settings', () => ({
    roles: {
        admin: 1,
        recruiter: 2,
        candidate: 3
    },
    employmentType: {
        fullTime: 1,
        partTime: 2,
        internship: 3,
        contract: 4
    }
}));
