import { Collapse } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { RichTreeView, TreeViewBaseItem } from "@mui/x-tree-view";
import { useSpring, animated } from '@react-spring/web';

interface TreeViewProps {
  treeItems: TreeViewBaseItem[],
}

const TreeView: React.FC<TreeViewProps> = ({
  treeItems
}) => {
  const transitionComponent = (props: TransitionProps) => {
    const style = useSpring({
      to: {
        opacity: props.in ? 1 : 0,
        transform: `translate3d(${props.in ? 0 : 20}px,0,0)`
      }
    })

    return (
      <animated.div style={style}>
        <Collapse {...props} />
      </animated.div>
    )
  }

  return (
    <RichTreeView 
      aria-label="customized"
      defaultExpandedItems={['1']}
      sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1}}
      slotProps={{ item: { slots: { groupTransition: transitionComponent } } }}
      items={treeItems}
    />
  );
};

export default TreeView;
