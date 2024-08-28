import { queryIndex } from 'lib'
import { User, RedisInstance, IndexName } from 'types'
import { ClientComponent } from './Client'

export default async function Community() {
  const isEmailInDb = await queryIndex({
    name: RedisInstance.Users,
    indexName: IndexName.UserByEmail,
    term: 'email',
    val: 'brian@actualed.com'
  })

  return <ClientComponent isEmailInDb={isEmailInDb} />
}