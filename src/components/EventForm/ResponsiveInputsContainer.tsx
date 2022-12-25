import * as styles from "./EventForm.styles";

/**
 * this container handles showing the mobile or desktop view of the first six inputs of our form
 * if on mobile, these six inputs are rendered in a column, if desktop, they are shown as two rows of three
 */
export const ResponsiveInputsContainer = ({
  children,
}: {
  children: React.ReactNode[];
}) => {
  const renderChildrenAsColumns = window.innerWidth < 425;

  if (renderChildrenAsColumns) {
    return <>{children}</>;
  }

  // desktop view, with two formatted rows
  const firstRow = children.slice(0, 3);
  const secondRow = children.slice(3, 6);
  return (
    <>
      <div style={styles.firstFormRow}>{firstRow}</div>
      <div style={styles.secondFormRow}>{secondRow}</div>
    </>
  );
};
