import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './redux/store';
import { searchSynonyms } from './redux/synonymsRedux';
import './App.css';
import defaultData from './helpers/data.json';
import styled from 'styled-components';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { Data } from './shared/interfaces/data.interface';
import { useNavigate } from 'react-router-dom';
import { Wrapper } from './shared/styles/styles';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [user_id, setUserId] = useState(2222);
  const [project_id, setProjectId] = useState(4444);
  const [mesh_terms, setMeshTerms] = useState(['Tryptophanase']);
  const [target_type, setTargetType] = useState('intervention');
  const [use_wikipedia, setWikipedia] = useState(false);
  const [threshold, setThreshold] = useState(50);
  const [is_device, setIsDevice] = useState(false);
  const error = useSelector((state: any) => state.synonyms.errorMessages);
  const navigate = useNavigate();

  const handleClick = (e: any) => {
    e.preventDefault();

    const data: Data = {
      user_id,
      project_id,
      mesh_terms,
      target_type,
      use_wikipedia,
      threshold,
      is_device,
    };
    dispatch(searchSynonyms(data)).then((res) => {
      if (res.meta.requestStatus === 'rejected') {
        toast.error(res.payload.response.data.detail[0].msg);
        console.log(res);
      } else {
        navigate('/results');
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <Wrapper className="App">
        <Form
          className="border p-5 shadow"
          style={{ width: '60%', height: '60%' }}
          onSubmit={handleClick}
        >
          <FormGroup>
            <Input
              type="number"
              defaultValue={defaultData.user_id}
              name="user_id"
              id="user_id"
              onChange={(e) => setUserId(Number(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="number"
              defaultValue={defaultData.project_id}
              name="project_id"
              id="project_id"
              onChange={(e) => setProjectId(Number(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="text"
              defaultValue={defaultData.mesh_terms}
              name="mesh_terms"
              id="mesh_terms"
              onChange={(e) => setMeshTerms((prev) => [e.target.value])}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="text"
              defaultValue={defaultData.target_type}
              name="target_type"
              id="target_type"
              onChange={(e) => setTargetType(e.target.value)}
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                onChange={(e) => setWikipedia((prev) => !prev)}
                defaultChecked={defaultData.use_wikipedia}
                type="checkbox"
              />{' '}
              Use wikipedia
            </Label>
          </FormGroup>
          <FormGroup>
            <Input
              type="number"
              defaultValue={defaultData.threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              name="threshold"
              id="threshold"
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                onChange={(e) => setIsDevice((prev) => !prev)}
                defaultChecked={defaultData.is_device}
                type="checkbox"
              />{' '}
              Is device
            </Label>
          </FormGroup>
          <Button className="pt-2" type="submit" block onClick={handleClick}>
            Submit
          </Button>
        </Form>
      </Wrapper>
    </>
  );
}

export default App;
