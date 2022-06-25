import React, { useEffect, useState } from 'react'
import { Form, Input, Grid, Card, Statistic } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

function Main(props) {
  const { api } = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState('')

  // The currently stored value
  const [currentMinValue, setCurrentMinValue] = useState(0)
  const [currentMaxValue, setCurrentMaxValue] = useState(0)
  const [formMinValue, setFormMinValue] = useState(0)
  const [formMaxValue, setFormMaxValue] = useState(0)

  useEffect(() => {
    let unsubscribe
    api.query.evelyn
      .minValue(newValue => {
        // The storage value is an Option<u32>
        // So we have to check whether it is None first
        // There is also unwrapOr
        if (newValue.isNone) {
          setCurrentMinValue('<None>')
        } else {
          setCurrentMinValue(newValue.unwrap().toNumber())
        }
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

      api.query.evelyn
      .maxValue(newValue => {
        // The storage value is an Option<u32>
        // So we have to check whether it is None first
        // There is also unwrapOr
        if (newValue.isNone) {
          setCurrentMaxValue('<None>')
        } else {
          setCurrentMaxValue(newValue.unwrap().toNumber())
        }
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api.query.evelyn])

  return (
    <Grid.Column width={8}>
      <h1>Evelyn Module</h1>
      <Card centered>
        <Card.Content textAlign="center">
          <Statistic label="Min" value={currentMinValue} />
          <Statistic label="Max" value={currentMaxValue} />
        </Card.Content>
      </Card>
      <Form>
        <Form.Field>
        <Input
          label="New Min"
          state="newMin"
          type="number"
          onChange={(_, { value }) => setFormMinValue(value)}
        />
        <Input
          label="New Max"
          state="newMax"
          type="number"
          onChange={(_, { value }) => setFormMaxValue(value)}
        />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Set Range"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'evelyn',
              callable: 'setRange',
              inputParams: [formMinValue, formMaxValue],
              paramFields: [true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}

export default function Evelyn(props) {
  const { api } = useSubstrateState()
  return api.query.evelyn && api.query.evelyn.minValue ? (
    <Main {...props} />
  ) : null
}
