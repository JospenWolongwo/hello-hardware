import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UploadService } from '../../../shared/interfaces/upload-service.interface';
import { PopUpMessageComponent } from '../../../shared/pop-up-message/pop-up-message.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-upload-images-dialog',
  templateUrl: './upload-images-dialog.component.html',
  styleUrls: ['./upload-images-dialog.component.scss'],
})
export class UploadImagesDialogComponent implements OnInit, OnDestroy {
  @Input() uploadService!: UploadService;
  @Input() entityId!: string;
  @Input() dialogTitle!: string;

  selectedFiles: File[] = [];
  previewUrls: { url: string; uploaded: boolean; fileName?: string }[] = [];
  uploadedImages: string[] = [];
  deletedImages: string[] = [];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<UploadImagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      entityId: string;
      uploadService: UploadService;
      dialogTitle: string;
    }
  ) {}

  ngOnInit(): void {
    if (!this.data?.uploadService || !this.data.entityId) {
      return;
    }

    this.entityId = this.data.entityId;
    this.uploadService = this.data.uploadService;
    this.dialogTitle = this.data.dialogTitle;

    this.loadExistingImages();
  }

  // Load existing images
  loadExistingImages(): void {
    if (!this.entityId) {
      return;
    }

    this.uploadService.getImages(this.entityId).subscribe({
      next: (images: { name: string }[]) => {
        images.forEach((img) => {
          if (img.name && !this.deletedImages.includes(img.name)) {
            this.previewUrls.push({
              url: this.getImageUrl(img.name),
              uploaded: true,
              fileName: img.name,
            });
            this.uploadedImages.push(img.name);
          }
        });
      },
      error: () => {
        this.showFeedbackDialog('Error', 'Failed to load images.', 'error');
      },
    });
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);

      files.forEach((file) => {
        this.selectedFiles.push(file);
        this.previewUrls.push({
          url: URL.createObjectURL(file),
          uploaded: false,
          fileName: file.name,
        });
      });
    }
  }

  // Upload Images
  onUploadImages(): void {
    if (this.selectedFiles.length === 0) {
      this.showFeedbackDialog('Error', 'No files selected.', 'error');

      return;
    }

    const totalFiles = this.selectedFiles.length;
    let uploadedCount = 0;
    let failedCount = 0;

    this.selectedFiles.forEach((file, index) => {
      const formData = new FormData();
      formData.append('file', file);

      this.uploadService.uploadImage(this.entityId, formData).subscribe({
        next: (response) => {
          this.previewUrls[index].uploaded = true;
          this.previewUrls[index].fileName = response?.body?.name;
          this.uploadedImages.push(response?.body?.name || 'Unknown');
          uploadedCount += 1;

          this.cdRef.detectChanges();
          this.checkUploadStatus(totalFiles, uploadedCount, failedCount);
        },
        error: () => {
          failedCount += 1;
          this.checkUploadStatus(totalFiles, uploadedCount, failedCount);
        },
      });
    });
  }

  deleteImage(index: number): void {
    const image = this.previewUrls[index];

    if (image.uploaded) {
      // Only attempt backend deletion if the image is marked as uploaded
      const fileName = image.fileName;

      if (fileName) {
        this.uploadService.deleteImage(fileName).subscribe({
          next: () => {
            this.showFeedbackDialog('Success', 'Image deleted successfully.', 'success');

            // Remove from uploaded images and preview URLs
            this.uploadedImages = this.uploadedImages.filter((name) => name !== fileName);
            this.previewUrls.splice(index, 1);
          },
          error: () => {
            this.showFeedbackDialog('Error', 'Failed to delete image.', 'error');
          },
        });
      } else {
        this.showFeedbackDialog('Error', 'Image file name is missing.', 'error');
      }
    } else {
      // Handle unuploaded images (local files)
      this.selectedFiles.splice(index, 1);
      this.previewUrls.splice(index, 1);

      this.cdRef.detectChanges();
    }
  }

  private checkUploadStatus(total: number, uploaded: number, failed: number): void {
    if (uploaded + failed === total) {
      if (failed === 0) {
        this.showFeedbackDialog('Success', 'All images uploaded successfully.', 'success');
      } else {
        this.showFeedbackDialog('Partial Success', `${uploaded} uploaded, ${failed} failed.`, 'warning');
      }
    }
  }

  private showFeedbackDialog(title: string, message: string, cssClass: string): void {
    this.dialog.open(PopUpMessageComponent, {
      data: { title, message, class: cssClass },
      width: '500px',
    });
  }

  private getImageUrl(fileName: string): string {
    return this.uploadService.getImageUrl(fileName);
  }

  get hasUnuploadedImages(): boolean {
    return this.previewUrls.some((image) => !image.uploaded);
  }

  ngOnDestroy(): void {
    this.previewUrls.forEach((preview) => {
      if (!preview.uploaded) {
        URL.revokeObjectURL(preview.url);
      }
    });
  }
}
