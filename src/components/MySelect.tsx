import { useField } from 'formik';
import { Form, InputGroup } from 'react-bootstrap';

interface Prop {
  label: string;
  name: string;
  placeholder: string;
  autoFocus?: boolean;
  icon: React.ReactNode | string;
  children: React.ReactNode;
  boton?: React.ReactNode;
}

export const MySelect = ({
  label,
  name,
  children,
  icon,
  boton,
  ...props
}: Prop) => {
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
        <Form.Select
          {...field}
          {...props}
          className={`${isError ? 'is-invalid' : ''}`}
        >
          {children}
        </Form.Select>
        {boton}
      </InputGroup>
      {isError ? (
        <div className='invalid-feedback d-flex'>{meta.error}</div>
      ) : null}
    </div>
  );
};
