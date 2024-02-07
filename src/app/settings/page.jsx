import CrudSettings from '@/components/CrudSettings'

export default function SettingsPage() {
  return (
    <div className='container'>
      <div className="row">
        <CrudSettings title="Estados" route="states" />
        <CrudSettings title="Categorias" route="categories" />
      </div>
    </div>
  )
}
