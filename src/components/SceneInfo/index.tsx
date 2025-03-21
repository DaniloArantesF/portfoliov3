import React from 'react';
import SideDrawer from '~/components/SideDrawer';
import Tabs from '~/components/Tabs';
import { useStore } from '@nanostores/react';
import { layout } from '~/lib/store/store';
import { useGUI } from '~/lib/sceneController';
import type { ProjectProps } from '~/pages/projects.astro';

type SceneInfoProps = {
  project: ProjectProps | null;
};

const SceneInfo: React.FC<SceneInfoProps> = ({ project }) => {
  const layoutState = useStore(layout);
  const pane = useStore(useGUI);

  return (
    <>
      <SideDrawer
        isOpen={false}
        side="left"
        label={'Info'}
        onOpen={() => {
          layoutState.isSceneInfoOpen = true;
          if (pane.expanded) {
            pane.expanded = false;
          }
        }}
        onClose={() => {
          layoutState.isSceneInfoOpen = false;
        }}
      >
        <Tabs
          title="Info"
          tabs={[
            {
              label: 'Info',
              content: (
                <div>
                  <h1>{project?.title}</h1>
                  {project?.description}
                </div>
              ),
            },
            {
              label: 'Credits',
              content: (
                <div>
                  <h2>Credits</h2>
                  {/* {project?.credits} */}
                </div>
              ),
            },
          ]}
        />
      </SideDrawer>
    </>
  );
};

export default SceneInfo;
