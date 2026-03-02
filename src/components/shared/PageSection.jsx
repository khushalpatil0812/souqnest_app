const PageSection = ({
  as: Component = 'section',
  sectionClassName = '',
  containerClassName = '',
  children,
  ...props
}) => {
  return (
    <Component className={sectionClassName} {...props}>
      <div className={containerClassName}>{children}</div>
    </Component>
  );
};

export default PageSection;
