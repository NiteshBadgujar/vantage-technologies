export function createInquiryController(service) {
  return (req, res, next) => {
    try {
      const inquiry = service.submit(req.body);
      return res.status(201).json({
        ok: true,
        requestId: req.requestId,
        inquiryId: inquiry.id,
        message: "Your inquiry is in. We’ll review it and get back to you.",
      });
    } catch (error) {
      return next(error);
    }
  };
}
