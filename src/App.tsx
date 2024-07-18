import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm, SubmitHandler } from "react-hook-form"
import ReactInputMask from 'react-input-mask';
import axios from 'axios';
import { useState } from 'react';

type Inputs={
  email:string
  number:string
}

function App() {
  const [searchResult,setSerachResult]=useState<Array<Inputs>>()
  const [isLoaded,setToLoaded]=useState<boolean>(true)

  const {
    register,
    handleSubmit,
    formState:{errors}}=useForm<Inputs>()

  const onSubmit:SubmitHandler<Inputs>=async(formData)=>{
    setToLoaded(false)
    try {
      const res=await axios.post('https://3205back-ingvr94s-projects.vercel.app',{
        email:formData.email,
        number:formData.number
      })
      setToLoaded(true)
      setSerachResult(res.data)
    }
    catch(err) {
      setToLoaded(true)
      alert('Ошибка загрузки')
      console.log(err)
    }
  }

  return (
    <div className='container mt-4'>
      <div className='text-center'>
        <h2>Введите данные</h2>
      </div>
      <div className='row justify-content-center my-5'>
        <div className='col-lg-6'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Введите e-mail</Form.Label>
            <Form.Control 
            className={errors.email && 'border border-2 border-danger' } 
            {...register('email',{required:true, pattern:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i})} 
            type="text" 
            placeholder="E-mail (обязательное поле)" />
            {errors.email && (<span className='text-danger fs-6 fw-lighter'>
              {errors.email.type==='required' && 'Заполните поле'}
              {errors.email.type==='pattern' && 'Некорректный e-mail'}
            </span>)}
          </Form.Group>
           <Form.Group className="mb-4" >
            <Form.Label>Введите число</Form.Label>
            <ReactInputMask className='form-control' {...register('number')} type="text" placeholder="XX-XX-XX (необязательное поле)" mask='99-99-99' />
          </Form.Group> 

          <Button variant="primary" type="submit">
            Отправить
          </Button>
        </Form>
        {!isLoaded && <div className="spinner-border text-primary text-center mt-3" role="status"></div>}
       
        {searchResult && 
      <div className='mt-3'>
        <h3>Результаты поиска:</h3>
          {searchResult.length === 0
            ?
            <h5 className='text-center'>
              Данные не найдены
            </h5>
            :
            searchResult.map((el:Inputs,i:number)=>(
              <ul key={i} className='list-group mb-3'>
                <li className='list-group-item list-group-item-primary'>Email: {el.email}</li>
                <li className='list-group-item list-group-item-primary'>Номер: {el.number}</li>
              </ul>
            ))
          }
      </div>
      }
        </div>
      </div>
    </div>
  )
}

export default App
