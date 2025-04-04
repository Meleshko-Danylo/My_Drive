﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyDrive.Data;
using MyDrive.DTO.File;
using MyDrive.Models;
using MyDrive.Services;

namespace MyDrive.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class FilesController: ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;
    private readonly FilesService _filesService;

    public FilesController(AppDbContext db, UserManager<AppUser> userManager, FilesService filesService)
    {
        _db = db;
        _userManager = userManager;
        _filesService = filesService;
    }
    
    [HttpGet("{folderId:guid}")]
    public async Task<ActionResult<FileResponseDto>> GetFiles(Guid folderId)
    {
        try {
            var files = await _filesService.GetFilesAsync(folderId);
            return Ok(files);
        }
        catch (Exception e) {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("{fileId:guid}")]
    public async Task<ActionResult<FileResponseDto>> GetFile(Guid fileId)
    {
        try {
            var file = await _filesService.GetFileInfoAsync(fileId);
            return Ok(file);
        }
        catch (Exception e) {
            return NotFound();
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadFile([FromForm] FileUploadDto file)
    {
        try {
            var uploadedFile = await _filesService.UploadFileAsync(file);
            return CreatedAtAction(nameof(GetFile), new { fileId = uploadedFile.Id }, uploadedFile);
        }
        catch (Exception e) {
            return BadRequest(e.Message);
        }
    }
    
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateFile([FromBody] UpdateFileDto file)
    {
        try {
            var updatedFile = await _filesService.UpdateFileInfoAsync(file);
            return Ok(updatedFile);
        }
        catch (Exception e) {
            return BadRequest(e.Message);
        }
    }
    
    [HttpDelete("{fileId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteFile(Guid fileId)
    {
        try {
            await _filesService.DeleteFileAsync(fileId);
            return Ok();
        }
        catch (Exception e) {
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet("{fileId:guid}")]
    public async Task<IActionResult> DownloadFile(Guid fileId)
    {
        try {
            return await _filesService.DownloadFileAsync(fileId, this);
        }
        catch (Exception e) {
            return BadRequest(e.Message);
        }
    }
}