import {
	createUseRemoteComponent,
	createRequires,
} from '@paciolan/remote-component';
import { resolve } from 'remote-component.config';

const requires = createRequires(resolve);

export const useRemoteComponent = createUseRemoteComponent({ requires });
