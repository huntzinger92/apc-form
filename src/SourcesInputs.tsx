import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import * as styles from "./SourcesInputs.styles";
import { StyledTextField } from "./StyledTextField";

interface ISourcesInputsProps {
  setNewSources: (sources: string[]) => void;
  newSources: string[];
  originalSources: string[];
}

export const SourcesInputs = ({
  setNewSources,
  newSources,
  originalSources,
}: ISourcesInputsProps) => {
  const handleNewSource = (linkString: string, index: number) => {
    const sourcesCopy = [...newSources];
    sourcesCopy[index] = linkString;
    setNewSources(sourcesCopy);
  };

  const handleAddSource = () => {
    setNewSources([...newSources, ""]);
  };

  const handleDeleteSource = (index: number) => {
    const sourcesCopy = [...newSources];
    sourcesCopy.splice(index, 1);
    setNewSources(sourcesCopy);
  };

  const isInputInvalid = (index: number) => {
    const isFirstInput = index === 0;
    const atLeastOneSourceProvided = !!newSources.find((source) => !!source);
    // show error on first input if no source provided yet
    return !atLeastOneSourceProvided && isFirstInput;
  };

  return (
    <div>
      <Typography style={styles.sourcesHeader}>Sources</Typography>
      <div style={styles.sourceInputsContainer}>
        {newSources.map((source, index) => (
          <div
            style={styles.inputRow}
            key={`${originalSources[index]}-${index}`}
          >
            <StyledTextField
              style={styles.inputStyle}
              error={isInputInvalid(index)}
              label={`Source ${index + 1}`}
              placeholder="https://en.wikipedia.org/"
              value={source}
              onChange={(e) => handleNewSource(e.target.value, index)}
            />
            <DeleteIcon
              style={styles.iconStyle}
              onClick={() => handleDeleteSource(index)}
            />
          </div>
        ))}
        <div style={styles.inputRow}>
          <AddIcon
            style={styles.iconStyle}
            onClick={handleAddSource}
            data-testid="add-source-icon"
          />
        </div>
      </div>
    </div>
  );
};
