import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const useFileDownload = () => {
  const downloadFile = async (fileData) => {
    try {
      // Handle both file dialog and messages cases
      const filename = fileData.filename || fileData.file_path;
      
      // If we have direct data content (from messages)
      if (fileData.data) {
        const fileUri = `${FileSystem.cacheDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(fileUri, fileData.data, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: `Save ${filename}`,
          UTI: 'public.plain-text'
        });
      } 
      // If we have a signedUrl (from file dialog)
      else if (fileData.signedUrl) {
        const fileUri = `${FileSystem.cacheDirectory}${filename}`;
        
        const downloadResumable = FileSystem.createDownloadResumable(
          fileData.signedUrl,
          fileUri,
          {},
          (downloadProgress) => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            // You can use this progress value to show a progress bar if needed
          }
        );

        const { uri } = await downloadResumable.downloadAsync();
        
        await Sharing.shareAsync(uri, {
          dialogTitle: `Save ${filename}`,
          UTI: 'public.item'
        });
      } else {
        throw new Error('Invalid file data structure');
      }
      
      return true;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  };

  return { downloadFile };
}; 