import { useField } from 'formik';
import { FormControl, InputGroup } from 'react-bootstrap';

interface Prop {
  label: string;
  name: string;
  placeholder: string;
  autoFocus?: boolean;
  icon: React.ReactNode | string;
}

export const MyInput = ({ label, name, icon, ...props }: Prop) => {
  const [field, meta] = useField({
    name,
  });

  const isError = meta.touched && meta.error;

  return (
    <div>
      <label className='d-flex' id={name}>
        {label}
      </label>
      <InputGroup>
        <InputGroup.Text>{icon}</InputGroup.Text>
        <FormControl
          {...field}
          {...props}
          className={`${isError ? 'is-invalid' : ''}`}
        />
      </InputGroup>
      {isError ? (
        <div className='invalid-feedback d-flex'>{meta.error}</div>
      ) : null}
    </div>
  );
};
