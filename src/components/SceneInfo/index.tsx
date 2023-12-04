import React, { useMemo } from 'react';
import SideDrawer from '~/components/SideDrawer';
import Tabs from '~/components/Tabs';
import type { Project } from '~/payload-types';
import { richTextToString } from '../RichText/serialize';
import RichText from '../RichText';
import { useStore } from '@nanostores/react';
import { layout } from '~/lib/store/store';
import { useGUI } from '~/lib/sceneController';

type SceneInfoProps = {
  project: Project | null;
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
                  <RichText content={project?.description as any} />
                </div>
              ),
            },
            {
              label: 'Credits',
              content: (
                <div>
                  <h2>Credits</h2>
                  <RichText content={project?.credits as any} />
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
