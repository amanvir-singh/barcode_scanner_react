import { useState, useEffect } from 'react';
import { useZxing } from "react-zxing";
import axios from 'axios';
import styled from 'styled-components';

const ScannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1rem;
`;

const ScannerWrapper = styled.div`
  position: relative;
  border: 2px solid #007bff;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ScannedData = styled.p`
  font-size: 1.2rem;
  color: #007bff;
  font-weight: bold;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ScanningIndicator = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
`;

const PermissionButton = styled(Button)`
  margin-top: 1rem;
  background-color: #28a745;
  
  &:hover {
    background-color: #218838;
  }
`;

function BarcodeScanner() {
  const [scannedData, setScannedData] = useState("No barcode scanned");
  const [isScanning, setIsScanning] = useState(true);
  const [hasCamera, setHasCamera] = useState(true);

  const { ref, start } = useZxing({
    onDecodeResult: async (result) => {
      if (isScanning) {
        setScannedData(result.getText());
        try {
          console.log(result.getText())
          await axios.post('http://localhost:3001/api/barcode', { barcodeData: result.getText() });
          alert('Barcode data saved successfully!');
          setIsScanning(false);
        } catch (err) {
          console.error('Error saving barcode data:', err);
          alert('Failed to save barcode data.');
        }
      }
    },
    onError: (error) => {
      console.error(error);
      setHasCamera(false);
    },
  });

  useEffect(() => {
    if (!isScanning) {
      const timer = setTimeout(() => {
        setIsScanning(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isScanning]);

  const handleReset = () => {
    setScannedData("No barcode scanned");
    setIsScanning(true);
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCamera(true);
      start();
    } catch (err) {
      console.error("Failed to get camera permission:", err);
      alert("Failed to get camera permission. Please check your browser settings.");
    }
  };

  return (
    <ScannerContainer>
      <Title>Barcode Scanner</Title>
      <ScannerWrapper>
        {hasCamera ? (
          <>
            <video ref={ref} width="300" height="300" />
            {isScanning && <ScanningIndicator>Scanning...</ScanningIndicator>}
          </>
        ) : (
          <>
            <ErrorMessage>Camera not available. Please check your permissions.</ErrorMessage>
            <PermissionButton onClick={requestCameraPermission}>
              Request Camera Permission
            </PermissionButton>
          </>
        )}
      </ScannerWrapper>
      <ScannedData>Scanned Data: {scannedData}</ScannedData>
      <Button onClick={handleReset}>Reset Scanner</Button>
    </ScannerContainer>
  );
}

export default BarcodeScanner;