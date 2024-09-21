import {createRoutesFromElements, Route} from 'react-router-dom';

import {ExamplePage} from '@/app-admin/pages/index';
import {Layout} from '@/app-admin/layouts/index';

const routes = createRoutesFromElements(
  <Route>
    <Route path="/admin">
      <Route element={<Layout />}>
        <Route index element={<ExamplePage />}></Route>
      </Route>
    </Route>
  </Route>,
);

export default routes;
