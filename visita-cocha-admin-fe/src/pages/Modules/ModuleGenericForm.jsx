import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BaseForm from '../../components/UI/BaseForm';
import { MODULE_TYPES } from '../../config/moduleTypes';
import { localStoreApi } from '../../api/localStoreApi';

export default function ModuleGenericForm(){
  const { moduleId, id } = useParams();
  const navigate = useNavigate();
  const moduleType = Object.values(MODULE_TYPES).find(m => m.id === moduleId) || { id: moduleId, name: moduleId, fields: [{name:'name',type:'text'}] };

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let mounted = true
    const load = async ()=>{
      if(id){
        const item = await localStoreApi.getById(moduleId, id)
        if(!mounted) return
        if(item) setValues(item)
      } else {
        // default values
        const defaults = {}
        (moduleType.fields||[]).forEach(f=>{
          defaults[f.name] = f.default || ''
        })
        setValues(defaults)
      }
    }
    load()
    return ()=> mounted = false
  },[moduleId,id])

  const handleChange = (name, value) => {
    setValues(prev=>({ ...prev, [name]: value }))
  }

  // convert BaseForm 'fields' definition from moduleTypes
  const formFields = (moduleType.fields||[]).map(f=>{
    const field = { name: f.name, label: f.label || f.name, type: f.type || 'text', required: !!f.required }
    if(f.type === 'select' && f.options) field.options = f.options
    if(f.type === 'file') field.accept = f.accept || 'image/*'
    return field
  })

  // intercept file inputs: convert to dataURL
  const handleSubmit = async (vals)=>{
    try{
      setLoading(true)
      const payload = { ...values }
      // ensure images array is serialized if files attached via temporary values
      // already handled by BaseForm as files are passed via onChange
      if(id){
        await localStoreApi.update(moduleId, id, payload)
      } else {
        await localStoreApi.create(moduleId, payload)
      }
      navigate(`/modules/${moduleId}`)
    }catch(e){
      setError('Error al guardar')
      console.error(e)
    }finally{ setLoading(false) }
  }

  const handleFieldChange = (fieldName, value) => {
    // if value is FileList or File, convert to dataURL
    if(value && (value instanceof File || (value instanceof Object && value[0] && value[0] instanceof File))){
      const files = value instanceof File ? [value] : Array.from(value)
      Promise.all(files.map(f=> new Promise((res,rej)=>{
        const r = new FileReader();
        r.onload = ()=> res(r.result);
        r.onerror = rej;
        r.readAsDataURL(f);
      }))).then(dataUrls=>{
        // store array or single depending on field
        setValues(prev=>({ ...prev, [fieldName]: dataUrls.length===1?dataUrls[0]:dataUrls }))
      }).catch(err=>console.error(err))
    } else {
      handleChange(fieldName, value)
    }
  }

  if(!moduleType) return <div>Módulo desconocido</div>

  return (
    <div>
      <h2>{id ? 'Editar' : 'Nuevo'} - {moduleType.name}</h2>
      <BaseForm
        title={`${id? 'Editar':'Nuevo'} ${moduleType.name}`}
        fields={formFields}
        values={values}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        isLoading={loading}
        error={error}
      />
    </div>
  )
}
