import { AppError } from "../errors.js";
import { validateInquiry } from "../validation/inquiry.js";

export class InquiryService {
  constructor(repository) {
    this.repository = repository;
  }

  submit(body) {
    if (body?.website && String(body.website).trim()) {
      throw new AppError(400, "BOT_DETECTED", "We could not validate this request.");
    }
    return this.repository.create(validateInquiry(body));
  }
}
