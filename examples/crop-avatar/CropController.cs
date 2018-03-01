using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace MyControllers
{
    public class CropController : Controller
    {
        private readonly string _avatarFolder = "/UploadedFiles/Avatar/";
        private decimal _maxWidthHeight = 300; // max with or height for resize in pixels

        private class AvatarData
        {
            public decimal X { get; set; }
            public decimal Y { get; set; }
            public decimal Height { get; set; }
            public decimal Width { get; set; }
            public int Rotate { get; set; }
        }

        private Bitmap RotateBitmap(Bitmap bitmap, float angle)
        {
            int w, h, x, y;
            var dW = (double) bitmap.Width;
            var dH = (double) bitmap.Height;

            double degrees = Math.Abs(angle);
            if (degrees <= 90)
            {
                double radians = 0.0174532925 * degrees;
                double dSin = Math.Sin(radians);
                double dCos = Math.Cos(radians);
                w = (int) (dH * dSin + dW * dCos);
                h = (int) (dW * dSin + dH * dCos);
                x = (w - bitmap.Width) / 2;
                y = (h - bitmap.Height) / 2;
            }
            else
            {
                degrees -= 90;
                double radians = 0.0174532925 * degrees;
                double dSin = Math.Sin(radians);
                double dCos = Math.Cos(radians);
                w = (int) (dW * dSin + dH * dCos);
                h = (int) (dH * dSin + dW * dCos);
                x = (w - bitmap.Width) / 2;
                y = (h - bitmap.Height) / 2;
            }

            var rotateAtX = bitmap.Width / 2f;
            var rotateAtY = bitmap.Height / 2f;

            var bmpRet = new Bitmap(w, h);
            bmpRet.SetResolution(bitmap.HorizontalResolution, bitmap.VerticalResolution);
            using (var graphics = Graphics.FromImage(bmpRet))
            {
                graphics.Clear(Color.White);
                graphics.TranslateTransform(rotateAtX + x, rotateAtY + y);
                graphics.RotateTransform(angle);
                graphics.TranslateTransform(-rotateAtX - x, -rotateAtY - y);
                graphics.DrawImage(bitmap, new PointF(0 + x, 0 + y));
            }

            return bmpRet;
        }

        private Bitmap ResizeBitmap(Bitmap bitmap, decimal maxWidthHeight)
        {
            if (bitmap.Width > maxWidthHeight || bitmap.Height > maxWidthHeight)
            {
                decimal newWidth = bitmap.Width;
                decimal newHeight = bitmap.Height;
                bool resized = false;
                if (newWidth > maxWidthHeight)
                {
                    newHeight = (maxWidthHeight / newWidth) * newHeight;
                    newWidth = maxWidthHeight;
                    resized = true;
                }

                if (newHeight > maxWidthHeight)
                {
                    newWidth = (maxWidthHeight / newHeight) * newWidth;
                    newHeight = maxWidthHeight;
                    resized = true;
                }

                if (resized)
                {
                    var resizedBitmap = new Bitmap((int) newWidth, (int) newHeight);
                    using (var graphics = Graphics.FromImage(resizedBitmap))
                    {
                        graphics.SmoothingMode = SmoothingMode.AntiAlias;
                        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                        graphics.DrawImage(bitmap, new Rectangle(0, 0, (int) newWidth, (int) newHeight));
                        bitmap = resizedBitmap;
                    }
                }
            }

            return bitmap;
        }

        private void UploadImage(HttpPostedFileBase file, AvatarData avatarData, out string errorMessage, out string newFileName)
        {
            errorMessage = null;
            newFileName = null;

            try
            {
                var fileExt = Path.GetExtension(file.FileName)?.ToLower().Substring(1);
                if (file.ContentLength / (1024 * 1024) > 10)
                {
                    errorMessage = "Error. File size must be less than 10 megabytes";
                    return;
                }

                if (fileExt == "jpeg" || fileExt == "jpg" || fileExt == "png" || fileExt == "gif" || fileExt == "tiff" || fileExt == "bmp")
                {
                    var bitmap = new Bitmap(file.InputStream);

                    if (avatarData.Rotate != 0)
                    {
                        bitmap = RotateBitmap(bitmap, avatarData.Rotate);
                    }

                    var cropedBitmap = new Bitmap((int)avatarData.Width, (int)avatarData.Height);
                    using (var graphics = Graphics.FromImage(cropedBitmap))
                    {
                        graphics.Clear(Color.White);
                        graphics.DrawImage(bitmap,
                            new Rectangle(0, 0, cropedBitmap.Width, cropedBitmap.Height),
                            new Rectangle((int) avatarData.X, (int) avatarData.Y, (int) avatarData.Width, (int) avatarData.Height),
                            GraphicsUnit.Pixel);
                        bitmap = cropedBitmap;
                    }

                    bitmap = ResizeBitmap(bitmap, _maxWidthHeight);

                    var encoderParameters = new EncoderParameters(1) { Param = { [0] = new EncoderParameter(Encoder.Quality, 50L) } };

                    var path = "~" + _avatarFolder;

                    newFileName = Guid.NewGuid() + ".jpg";
                    var encoder = ImageCodecInfo.GetImageDecoders().First(codec => codec.FormatID == ImageFormat.Jpeg.Guid);
                    bitmap.Save(Path.Combine(Server.MapPath(path), newFileName), encoder, encoderParameters);
                }
                else
                {
                    errorMessage = "Error. Wrong format. Use only: jpeg, jpg, gif, png.";
                    return;
                }
            }
            catch (Exception exc)
            {
                errorMessage = "Error in processing. Check the image file." + exc.Message;
                return;
            }
        }

        [Authorize]
        [HttpPost]
        public ActionResult UploadAvatar(HttpPostedFileBase avatar_file, string avatar_src, string avatar_data)
        {
            AvatarData avatarData = new JavaScriptSerializer().Deserialize<AvatarData>(avatar_data);

            UploadImage(avatar_file, avatarData, out var errorMessage, out var fileName);

            if (!string.IsNullOrEmpty(fileName))
            {
                fileName = ".." + _avatarFolder + fileName;
            }
            return Json(new
                {
                    result = fileName,
                    message = errorMessage,
                    state = 200
                }
                , JsonRequestBehavior.AllowGet);
        }
    }
}