import BarcodeScanner from './Components/BarcodeScanner';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e9ecef;
`;

function App() {
  return (
    <AppContainer>
      <BarcodeScanner />
    </AppContainer>
  );
}

export default App;