using Microsoft.AspNetCore.Mvc;
using ReportsService.Models;
using ReportsService.Services;

namespace ReportsService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ReportsController : ControllerBase
{
    private readonly ReportService _reportService;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(ReportService reportService, ILogger<ReportsController> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    /// <summary>Get project status report</summary>
    [HttpGet("project/{projectId}/status")]
    [ProducesResponseType(typeof(ProjectStatusReport), StatusCodes.Status200OK)]
    public ActionResult<ProjectStatusReport> GetProjectStatus(string projectId)
    {
        var report = _reportService.GenerateProjectStatusReport(projectId);
        return Ok(report);
    }

    /// <summary>Get sprint summary for a project</summary>
    [HttpGet("project/{projectId}/sprint/{sprintNumber}")]
    [ProducesResponseType(typeof(SprintSummary), StatusCodes.Status200OK)]
    public ActionResult<SprintSummary> GetSprintSummary(string projectId, int sprintNumber)
    {
        var summary = _reportService.GenerateSprintSummary(projectId, sprintNumber);
        return Ok(summary);
    }

    /// <summary>Download PDF report for a project</summary>
    [HttpGet("project/{projectId}/pdf")]
    [Produces("application/pdf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult DownloadPdf(string projectId)
    {
        var pdfBytes = _reportService.GeneratePdfReport(projectId);
        return File(pdfBytes, "application/pdf", $"project-report-{projectId}-{DateTime.UtcNow:yyyyMMdd}.pdf");
    }

    /// <summary>Health check</summary>
    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "healthy", service = "ReportsService", timestamp = DateTime.UtcNow });
}
