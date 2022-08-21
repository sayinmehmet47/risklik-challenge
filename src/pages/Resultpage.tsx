import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Progress } from 'reactstrap';
import ReactTable from '../components/ReactTable';
import { ProgressContainer, Wrapper } from '../shared/styles/styles';

export default function ResultPage() {
  const status = useSelector((state: any) => state.synonyms.status.state);
  const results = useSelector((state: any) => state.synonyms.results.synonyms);

  const [value, setValue] = useState(0);

  useEffect(() => {
    const count = setInterval(() => setValue((oldCount) => oldCount + 1), 80);
    if (status === 'SUCCESSFUL') {
      clearInterval(count);
    }
    return () => clearInterval(count);
  }, [status]);

  if (status === 'IN_PROGRESS') {
    return (
      <Wrapper>
        <ProgressContainer>
          <Progress value={value} animated />
          <h2 className="mt-3">ON PROGRESS ...</h2>
        </ProgressContainer>
      </Wrapper>
    );
  }
  return <Wrapper>{results?.length > 0 && <ReactTable />}</Wrapper>;
}
